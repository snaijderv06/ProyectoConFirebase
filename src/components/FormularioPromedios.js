import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioPromedios = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const guardarPromedio = async () => {
    if (nombre && edad) {
      try {
        const docRef = await addDoc(collection(db, "edades"), {
          nombre: nombre,
          edad: parseInt(edad),
        });
        setNombre("");
        setEdad("");
        cargarDatos(); // Volver a cargar la lista
        alert(`Promedio registrado. Enlace de confirmación: https://tu-app.com/confirmar/${docRef.id}`);
      } catch (error) {
        console.error("Error al registrar promedio:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Promedios</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <Button title="Guardar Promedio" onPress={guardarPromedio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioPromedios;