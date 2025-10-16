import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import FormularioUsuarios from "../components/FormularioUsuarios";
import TablaUsuarios from "../components/TablaUsuarios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: "", correo: "", telefono: "", edad: "" });
  const navigation = useNavigation();

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      cargarDatos(); // Recarga la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const validarDatos = async (datos) => {
  try {
    const validDatos = await fetch("https://qn1wrartc8.execute-api.us-east-2.amazonaws.com/validar-registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!validDatos.ok) {
      throw new Error(`HTTP error! status: ${validDatos.status}`);
    }

    const resultado = await validDatos.json();

    if (resultado.success) {
      return resultado.data; // Devuelve datos limpios y validados
    } else {
      // Verifica si errors existe y es un array antes de usar join
      const errorMessage = resultado.errors && Array.isArray(resultado.errors) 
        ? resultado.errors.join("\n") 
        : "Error desconocido al validar los datos";
      Alert.alert("Errores en los datos", errorMessage);
      return null;
    }
  } catch (error) {
    console.error("Error al validar con Lambda:", error.message);
    Alert.alert("Error", `No se pudo validar la información. Detalle: ${error.message}`);
    return null;
  }
};

  // Método para guardar un nuevo usuario
  const guardarUsuario = async (datos) => {
    const guardarDatosUsuario = async () => {
      const datosValidados = await validarDatos(datos);
      if (datosValidados) {
        try {
          await addDoc(collection(db, "usuarios"), {
            nombre: datosValidados.nombre,
            correo: datosValidados.correo,
            telefono: datosValidados.telefono,
            edad: parseInt(datosValidados.edad),
          });
          cargarDatos(); // Recarga la lista después de guardar
          setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
          Alert.alert("Éxito", "Usuario registrado correctamente.");
        } catch (error) {
          console.error("Error al registrar usuario:", error);
        }
      }
    };

    guardarDatosUsuario().catch((error) => {
      console.error("Error al registrar usuario:", error);
    });
  };

  // Método para actualizar un usuario
  const actualizarUsuario = async (id, nuevoUsuario) => {
    const actualizarDatosUsuario = async () => {
      const datosValidados = await validarDatos(nuevoUsuario);
      if (datosValidados) {
        try {
          await updateDoc(doc(db, "usuarios", id), {
            nombre: datosValidados.nombre,
            correo: datosValidados.correo,
            telefono: datosValidados.telefono,
            edad: parseInt(datosValidados.edad),
          });
          cargarDatos(); // Recarga la lista después de actualizar
          setModoEdicion({ id: false, nombre: "", correo: "", telefono: "", edad: "" });
          Alert.alert("Éxito", "Usuario actualizado correctamente.");
        } catch (error) {
          console.error("Error al actualizar usuario:", error);
        }
      }
    };

    actualizarDatosUsuario().catch((error) => {
      console.error("Error al actualizar usuario:", error);
    });
  };

  return (
    <View style={styles.container}>
      <FormularioUsuarios 
        cargarDatos={cargarDatos} 
        validarDatos={validarDatos} 
        guardarUsuario={guardarUsuario} 
        actualizarUsuario={actualizarUsuario}
      />
      <TablaUsuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} />
      <Button
        title="Ir a Promedios"
        onPress={() => navigation.navigate('Promedio')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Usuarios;