
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation, cerrarSesion }) => {
  const menuItems = [
    { title: "Productos", icon: "basket-outline", screen: "Productos" },
    { title: "Clientes", icon: "people-outline", screen: "Clientes" },
    { title: "Usuarios", icon: "person-outline", screen: "Usuarios" },
    { title: "Promedio", icon: "calculator-outline", screen: "Promedio" },
    { title: "Productos Realtime", icon: "sync-outline", screen: "ProductosRT" },
    { title: "Calcular IMC", icon: "body-outline", screen: "CalcularIMC" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Bienvenido a Mi App</Text>
      <Text style={styles.subtitulo}>Selecciona una opción</Text>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={40} color="#0066cc" />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.textoCerrar}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  titulo: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginTop: 50, color: "#333" },
  subtitulo: { fontSize: 18, textAlign: "center", marginBottom: 30, color: "#666" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", padding: 20 },
  card: {
    backgroundColor: "white",
    width: "45%",
    padding: 25,
    marginBottom: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardText: { marginTop: 15, fontSize: 16, fontWeight: "600", color: "#333" },
  botonCerrar: {
    flexDirection: "row",
    backgroundColor: "#dc3545",
    margin: 30,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textoCerrar: { color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10 },
});

export default Home;