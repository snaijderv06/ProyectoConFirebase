import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
// Importamos el componente de botón de eliminación
import BotonEliminarPromedio from "./BotonEliminarPromedio"; 

// Recibimos 'datos' (inicializado a [] para evitar errores) y la función 'eliminarUsuario'
const TablaPromedios = ({ datos = [], eliminarUsuario }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Promedios</Text>

      {/* Encabezado de la tabla */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
        {/* Columna para el botón de eliminación */}
        <Text style={[styles.celdaAccion, styles.textoEncabezado]}>Acción</Text> 
      </View>

      {/* Contenido de la tabla */}
      <ScrollView>
        {datos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.edad}</Text>
            {/* Celda para el botón de eliminación */}
            <View style={styles.celdaAccion}>
              <BotonEliminarPromedio
                id={item.id}
                eliminarPromedio={eliminarUsuario} // Corregido el nombre de la prop
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: "stretch",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  // Estilo para la nueva columna de acción
  celdaAccion: { 
    flex: 0.5, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
});

export default TablaPromedios;