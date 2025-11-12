import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { ref, push, onValue } from 'firebase/database';
import { realtimeDB } from '../database/firebaseconfig';

const CalculadoraIMC = () => {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(null);
  const [clasificacion, setClasificacion] = useState('');
  const [historial, setHistorial] = useState([]);

  // Calcular IMC
  const calcular = () => {
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100;

    if (!p || !a || p <= 0 || a <= 0) {
      Alert.alert('Error', 'Ingresa peso y altura válidos.');
      return;
    }

    const resultado = p / (a * a);
    setImc(resultado.toFixed(2));

    let clase = '';
    if (resultado < 18.5) clase = 'Bajo peso';
    else if (resultado < 25) clase = 'Peso normal';
    else if (resultado < 30) clase = 'Sobrepeso';
    else clase = 'Obesidad';

    setClasificacion(clase);
  };

  // Confirmar y guardar
  const guardar = () => {
    if (!imc) {
      Alert.alert('Advertencia', 'Primero calcula el IMC.');
      return;
    }

    Alert.alert(
      'Confirmar',
      `¿Guardar?\nPeso: ${peso} kg\nAltura: ${altura} cm\nIMC: ${imc} (${clasificacion})`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Guardar', onPress: subirRegistro },
      ]
    );
  };

  // Subir a Firebase
  const subirRegistro = async () => {
    try {
      const nuevo = {
        peso: Number(peso),
        altura: Number(altura),
        imc: Number(imc),
        clasificacion,
        fecha: new Date().toISOString(),
      };

      await push(ref(realtimeDB, 'imc_registros'), nuevo);

      Alert.alert('Éxito', 'Cálculo guardado correctamente.');
      limpiarCampos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar.');
    }
  };

  const limpiarCampos = () => {
    setPeso('');
    setAltura('');
    setImc(null);
    setClasificacion('');
  };

  // Leer historial en tiempo real
  useEffect(() => {
    const referencia = ref(realtimeDB, 'imc_registros');
    const unsubscribe = onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.entries(data).map(([id, valores]) => ({
          id,
          ...valores,
        }));
        lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setHistorial(lista);
      } else {
        setHistorial([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Calculadora de IMC</Text>

      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />

      <TextInput
        style={styles.input}
        placeholder="Altura (cm)"
        keyboardType="numeric"
        value={altura}
        onChangeText={setAltura}
      />

      <Button title="Calcular IMC" onPress={calcular} color="#007AFF" />

      {imc && (
        <View style={styles.resultado}>
          <Text style={styles.imc}>IMC: {imc}</Text>
          <Text style={styles.clase}>{clasificacion}</Text>
        </View>
      )}

      <View style={styles.botonGuardar}>
        <Button title="Guardar Registro" onPress={guardar} color="#34C759" />
      </View>

      <Text style={styles.subtitulo}>Historial de Cálculos</Text>

      {historial.length === 0 ? (
        <Text style={styles.vacio}>No hay registros</Text>
      ) : (
        historial.map((item) => (
          <View key={item.id} style={styles.registro}>
            <Text style={styles.fecha}>
              {new Date(item.fecha).toLocaleString()}
            </Text>
            <Text>
              {item.peso} kg, {item.altura} cm → IMC: {item.imc} ({item.clasificacion})
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  resultado: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    alignItems: 'center',
  },
  imc: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  clase: { fontSize: 18, marginTop: 5 },
  botonGuardar: { marginVertical: 15 },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 10 },
  vacio: { color: '#888', fontStyle: 'italic', textAlign: 'center' },
  registro: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  fecha: { fontSize: 12, color: '#666', marginBottom: 4 },
});

export default CalculadoraIMC;