import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BotonEliminarCliente from "../components/BotonEliminarCliente";

const TablaUsuarios = ({ usuarios, eliminarUsuario }) => {
  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.header}>Nombre</Text>
        <Text style={styles.header}>Correo</Text>
        <Text style={styles.header}>Teléfono</Text>
        <Text style={styles.header}>Edad</Text>
        <Text style={styles.header}>Acción</Text>
      </View>

      {usuarios.length === 0 ? (
        <Text style={styles.sinDatos}>No hay usuarios registrados</Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.fila}>
              <Text style={styles.celda}>{item.nombre || "-"}</Text>
              <Text style={styles.celda}>{item.correo || "-"}</Text>
              <Text style={styles.celda}>{item.telefono || "-"}</Text>
              <Text style={styles.celda}>{item.edad || "?"}</Text>
              <View style={styles.celda}>
                <BotonEliminarCliente id={item.id} eliminarUsuario={eliminarUsuario} />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, backgroundColor: "white", borderRadius: 10, overflow: "hidden", elevation: 3 },
  encabezado: { flexDirection: "row", backgroundColor: "#0066cc", padding: 14 },
  header: { flex: 1, color: "white", fontWeight: "bold", textAlign: "center" },
  fila: { flexDirection: "row", padding: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  celda: { flex: 1, textAlign: "center" },
  sinDatos: { textAlign: "center", padding: 30, color: "#888", fontStyle: "italic" },
});

export default TablaUsuarios;