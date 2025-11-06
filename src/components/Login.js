import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebaseconfig";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const manejadorLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa ambos campos.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Notifica al componente App que el login fue exitoso
      console.log("Sesión iniciada");
      let mensaje = "Sesión iniciada.";
    } catch (error) {
      console.error("Error de autenticación:", error); // Log del error completo
      let mensaje = "Error al iniciar sesión.";
      if (error.code === "auth/invalid-email") {
        mensaje = "Correo inválido.";
      } else if (error.code === "auth/user-not-found") {
        mensaje = "Usuario no encontrado.";
      } else if (error.code === "auth/wrong-password") {
        mensaje = "Contraseña incorrecta.";
      } else if (error.code === "auth/network-request-failed") {
        mensaje = "Error de conexión. Verifica tu internet.";
      } else {
        mensaje = `Error: ${error.message}`; // Muestra el mensaje específico del error
      }
      Alert.alert("Error", mensaje);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.boton} onPress={manejadorLogin}>
        <Text style={styles.textoBoton}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  boton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Login;