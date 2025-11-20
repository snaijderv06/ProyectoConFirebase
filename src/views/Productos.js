import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { db } from "../database/firebaseconfig.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import * as DocumentPicker from "expo-document-picker";
import XLSX from "xlsx";

import FormularioProductos from "../components/FormularioProductos";
import TablaProductos from "../components/TablaProductos.js";

const Productos = ({ cerrarSesion }) => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const navigation = useNavigation();

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejoCambio = (campo, valor) => {
    setNuevoProducto((prev) => ({ ...prev, [campo]: valor }));
  };

  const guardarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    try {
      await addDoc(collection(db, "productos"), {
        nombre: nuevoProducto.nombre.trim(),
        precio: parseFloat(nuevoProducto.precio),
      });
      setNuevoProducto({ nombre: "", precio: "" });
      cargarDatos();
      Alert.alert("Éxito", "Producto agregado");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

  const actualizarProducto = async () => {
    try {
      await updateDoc(doc(db, "productos", productoId), {
        nombre: nuevoProducto.nombre.trim(),
        precio: parseFloat(nuevoProducto.precio),
      });
      setNuevoProducto({ nombre: "", precio: "" });
      setModoEdicion(false);
      setProductoId(null);
      cargarDatos();
      Alert.alert("Éxito", "Producto actualizado");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const exportarDatos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "productos"));
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const jsonString = JSON.stringify(datos, null, 2);
      const fileUri = FileSystem.cacheDirectory + "productos.json";
      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      await Clipboard.setStringAsync(jsonString);
      await Sharing.shareAsync(fileUri);
      Alert.alert("Éxito", "Datos exportados");
    } catch (error) {
      Alert.alert("Error", "No se pudo exportar");
    }
  };

  const extraerYGuardarMascotas = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result.canceled) {
        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
        const workbook = XLSX.read(fileContent, { type: "base64" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        Alert.alert("Éxito", `Se leyeron ${data.length} mascotas`);
        
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo leer el archivo");
    }
  };

  // 3. GENERAR EXCEL DE PRODUCTOS
  const generarExcel = async () => {
    try {
      const ws = XLSX.utils.json_to_sheet(productos.map(p => ({ Nombre: p.nombre, Precio: p.precio })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const uri = FileSystem.cacheDirectory + "productos.xlsx";
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(uri);
      Alert.alert("Éxito", "Excel de productos generado");
    } catch (error) {
      Alert.alert("Error", "No se pudo generar Excel");
    }
  };

  // 4. GENERAR EXCEL DE CIUDADES
  const generarExcel2 = async () => {
    try {
      const snapshot = await getDocs(collection(db, "ciudades"));
      const ciudades = snapshot.docs.map(doc => doc.data());
      const ws = XLSX.utils.json_to_sheet(ciudades);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Ciudades");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const uri = FileSystem.cacheDirectory + "ciudades.xlsx";
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
      await Sharing.shareAsync(uri);
      Alert.alert("Éxito", "Excel de ciudades generado");
    } catch (error) {
      Alert.alert("Error", "No se pudo generar Excel de ciudades");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Gestión de Productos</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>
          {modoEdicion ? "Editar Producto" : "Agregar Producto"}
        </Text>
        <FormularioProductos
          nuevoProducto={nuevoProducto}
          manejoCambio={manejoCambio}
          guardarProducto={modoEdicion ? actualizarProducto : guardarProducto}
          modoEdicion={modoEdicion}
        />
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Lista de Productos</Text>
        <TablaProductos
          productos={productos}
          editarProducto={editarProducto}
          eliminarProducto={eliminarProducto}
        />
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Acciones</Text>
        <View style={styles.botonesGrid}>
          <Button title="Exportar Datos" onPress={exportarDatos} color="#28a745" />
          <Button title="Extraer Mascotas Excel" onPress={extraerYGuardarMascotas} color="#17a2b8" />
          <Button title="Generar Excel Productos" onPress={generarExcel} color="#fd7e14" />
          <Button title="Generar Excel Ciudades" onPress={generarExcel2} color="#ffc107" />
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Navegación</Text>
        <View style={styles.botonesGrid}>
          <Button title="Clientes" onPress={() => navigation.navigate("Clientes")} />
          <Button title="Productos Realtime" onPress={() => navigation.navigate("ProductosRT")} />
        </View>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 50, backgroundColor: "#0066cc" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "white" },
  botonCerrar: { backgroundColor: "#dc3545", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  textoCerrar: { color: "white", fontWeight: "bold" },
  seccion: { backgroundColor: "white", marginHorizontal: 15, marginTop: 15, padding: 20, borderRadius: 15, elevation: 4 },
  subtitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#333" },
  botonesGrid: { gap: 10 },
});

export default Productos;