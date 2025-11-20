import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";

const FormularioUsuarios = ({ guardarUsuario }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");

  const handleGuardar = () => {
    if (!nombre.trim() || !correo.trim() || !telefono.trim() || !edad.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (!correo.includes("@")) {
      Alert.alert("Error", "El correo debe contener @");
      return;
    }

    if (telefono.replace(/[^0-9]/g, "").length !== 8) {
      Alert.alert("Error", "El teléfono debe tener 8 dígitos");
      return;
    }

    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 120) {
      Alert.alert("Error", "Edad inválida (1-120 años)");
      return;
    }

    guardarUsuario({
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      edad: edadNum,
    });

    // Limpiar formulario
    setNombre("");
    setCorreo("");
    setTelefono("");
    setEdad("");
    Alert.alert("Éxito", "Usuario registrado correctamente");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Usuario</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Teléfono (8 dígitos)" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" maxLength={15} />
      <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} keyboardType="numeric" maxLength={3} />

      <Button title="Guardar Usuario" onPress={handleGuardar} color="#0066cc" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa", borderRadius: 12, marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  input: { backgroundColor: "white", padding: 14, borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: "#ddd", fontSize: 16 },
});

export default FormularioUsuarios;