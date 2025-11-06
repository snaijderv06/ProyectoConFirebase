import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, query, where, orderBy, limit, } from "firebase/firestore";
import ListaProductos from "../components/ListaProductos";
import FormularioProductos from "../components/FormularioProductos";
import TablaProductos from "../components/TablaProductos.js";
import { useNavigation } from '@react-navigation/native'; 
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

const Productos = ({ cerrarSesion }) => { // Recibe cerrarSesion como prop
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false); // Estado para modo edición
  const [productoId, setProductoId] = useState(null);  // ID del producto en edición
  const navigation = useNavigation(); 
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: ""
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };
  
  const cargarDatosFirebase = async (nombreColeccion) => {
  if (!nombreColeccion || typeof nombreColeccion !== 'string') {
    console.error("Error: Se requiere un nombre de colección válido.");
    return;
  }

  try {
    const datosExportados = {};

    // Obtener la referencia a la colección específica
    const snapshot = await getDocs(collection(db, nombreColeccion));

    // Mapear los documentos y agregarlos al objeto de resultados
    datosExportados[nombreColeccion] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return datosExportados;
  } catch (error) {
    console.error(`Error extrayendo datos de la colección '${nombreColeccion}':`, error);
  }
};

const exportarDatos = async () => {
  try {
    const datos = await cargarDatosFirebase("productos");
    console.log("Datos cargados:", datos);

    // Formatea los datos para el archivo y el portapapeles
    const jsonString = JSON.stringify(datos, null, 2);
    const baseFileName = "datos_firebase.txt";

    // Copiar datos al portapapeles
    await Clipboard.setStringAsync(jsonString);
    console.log("Datos (JSON) copiados al portapapeles.");

    // Verificar si la función de compartir está disponible
    if (!(await Sharing.isAvailableAsync())) {
      alert("La función Compartir/Guardar no está disponible en tu dispositivo");
      return;
    }

    // Guardar el archivo temporalmente
    const fileUri = FileSystem.cacheDirectory + baseFileName;

    // Escribir el contenido JSON en el caché temporal
    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    // Abrir el diálogo de compartir
    await Sharing.shareAsync(fileUri, {
      mimeType: "text/plain",
      dialogTitle: "Compartir datos de Firebase (JSON)",
    });

    alert("Datos copiados al portapapeles y listos para compartir.");
  } catch (error) {
    console.error("Error al exportar y compartir:", error);
    alert("Error al exportar y compartir: " + error.message);
  }
};

  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const cargarCiudadesFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "ciudades"));
      const ciudades = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return ciudades;
    } catch (error) {
      console.error("Error extrayendo ciudades:", error);
      return [];
    }
  };

  const generarExcel2 = async () => {
  try {
    // 1. Cargar ciudades desde Firebase
    const ciudades = await cargarCiudadesFirebase();

    // Validar que haya datos
    if (ciudades.length === 0) {
      throw new Error("No hay datos en la colección 'ciudades'.");
    }

    console.log("Ciudades para Excel:", ciudades);

    // 2. Enviar al backend (Lambda)
    const response = await fetch("https://263h3d7q2f.execute-api.us-east-2.amazonaws.com/generarexcel2  ", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({datos: ciudades }) // Enviar directamente el array
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // 3. Obtener ArrayBuffer y convertir a base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    // 4. Ruta para guardar el archivo temporalmente
    const fileUri = FileSystem.documentDirectory + "reporte_ciudades.xlsx";

    // 5. Escribir el archivo Excel
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64
    });

    // 6. Compartir el archivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Descargar Reporte de Ciudades"
      });
    } else {
      alert("Compartir no disponible.");
    }

    // Éxito
    alert("Excel de ciudades generado y listo para descargar.");

  } catch (error) {
    console.error("Error generando Excel:", error);
    alert("Error: " + error.message);
  }
};

  const generarExcel = async () => {
  try {
    const datosParaExcel = [
      { nombre: "Producto A", categoria: "Electrónicos", precio: 100 },
      { nombre: "Producto B", categoria: "Ropa", precio: 50 },
      { nombre: "Producto C", categoria: "Electrónicos", precio: 75 }
    ];

    const response = await fetch("https://263h3d7q2f.execute-api.us-east-2.amazonaws.com/generarexcel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datos: datosParaExcel })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Obtención de ArrayBuffer y conversión a base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    // Ruta para guardar el archivo temporalmente
    const fileUri = FileSystem.documentDirectory + "reporte.xlsx";

    // Escribir el archivo Excel en el sistema de archivos
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64
    });

    // Compartir el archivo generado
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Descargar Reporte Excel"
      });
    } else {
      alert("Compartir no disponible. Revisa la consola para logs.");
    }

  } catch (error) {
    console.error("Error generando Excel:", error);
    alert("Error: " + error.message);
  }
};

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        cargarDatos(); // Recargar lista
        setNuevoProducto({ nombre: "", precio: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  const editarProducto = (producto) => { // Método para cargar valores al formulario
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

    const pruebaConsulta1 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 1 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 1:", error);
    }
  };
  

  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await updateDoc(doc(db, "productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false); // Volver al modo registro
        setProductoId(null);
        cargarDatos(); // Recargar lista
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    pruebaConsulta1();
  }, []);

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos(); 
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <View style={styles.container}>
      {/* Botón Cerrar Sesión encima del formulario */}
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
     <View style={{ marginVertical: 10 }}>
  <Button title="Exportar" onPress={exportarDatos} />
</View>
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={modoEdicion ? actualizarProducto : guardarProducto}
        modoEdicion={modoEdicion} // Pasamos la variable de estado
        actualizarProducto={actualizarProducto} // Pasamos el método
      />
      <ListaProductos productos={productos} editarProducto={editarProducto} />
      <TablaProductos
        productos={productos}
        editarProducto={editarProducto} // Pasamos el método a TablaProductos
        eliminarProducto={eliminarProducto}
      />
      <View style={{ marginVertical: 10 }}>
  <Button title="Generar Excel de ciudades" onPress={generarExcel2} />
     </View>
      <View style={{ marginVertical: 10 }}>
  <Button title="Generar Excel" onPress={generarExcel} />
     </View>
      <Button
        title="Ir a Clientes"
        onPress={() => navigation.navigate('Clientes')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;