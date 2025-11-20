import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import FormularioUsuarios from "../components/FormularioUsuarios";
import TablaUsuarios from "../components/TablaUsuarios";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigation = useNavigation();

  // CARGAR USUARIOS DESDE FIREBASE
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ELIMINAR USUARIO
  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "Usuarios", id));
      cargarDatos();
      Alert.alert("Éxito", "Usuario eliminado correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el usuario");
    }
  };

  // GUARDAR USUARIO DIRECTO EN FIREBASE (SIN LAMBDA)
  const guardarUsuario = async (datos) => {
    try {
      await addDoc(collection(db, "Usuarios"), datos);
      cargarDatos();
      Alert.alert("Éxito", "Usuario registrado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar el usuario");
    }
  };

  return (
    <View style={styles.container}>
      <FormularioUsuarios guardarUsuario={guardarUsuario} />
      <TablaUsuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} />
      <Button 
        title="Ir a Promedios" 
        onPress={() => navigation.navigate('Promedio')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f5f5f5" 
  },
});

export default Usuarios;