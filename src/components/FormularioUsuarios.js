import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { db } from "../database/firebaseconfig";

const FormularioUsuarios = ({ cargarDatos, validarDatos, guardarUsuario, actualizarUsuario }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");
  const [modoEdicion, setModoEdicion] = useState({ id: null, editando: false });

  const handleGuardar = () => {
    if (nombre && correo && telefono && edad) {
      const datos = { nombre, correo, telefono, edad: parseInt(edad) };
      if (modoEdicion.editando) {
        actualizarUsuario(modoEdicion.id, datos);
        setModoEdicion({ id: null, editando: false });
      } else {
        guardarUsuario(datos);
      }
      setNombre("");
      setCorreo("");
      setTelefono("");
      setEdad("");
    } else {
      Alert.alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Usuarios</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <Button title="Guardar cambios" onPress={handleGuardar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioUsuarios;