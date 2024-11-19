import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Função para carregar os dados dos profissionais do AsyncStorage
  const loadData = async () => {
    try {
      const storedProfissionais = await AsyncStorage.getItem('profissionais');
      if (storedProfissionais) {
        setProfissionais(JSON.parse(storedProfissionais));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Função para salvar os dados dos profissionais no AsyncStorage
  const saveData = async (updatedProfissionais) => {
    try {
      await AsyncStorage.setItem('profissionais', JSON.stringify(updatedProfissionais));
    } catch (error) {
      console.log(error);
    }
  };

  // Função para adicionar ou editar um profissional
  const handleSubmit = () => {
    const updatedProfissionais = [...profissionais];
    if (editIndex !== null) {
      updatedProfissionais[editIndex] = { nome, cargo };
    } else {
      updatedProfissionais.push({ nome, cargo });
    }
    setProfissionais(updatedProfissionais);
    saveData(updatedProfissionais);
    setNome('');
    setCargo('');
    setEditIndex(null);
  };

  // Função para editar um profissional
  const handleEdit = (index) => {
    setNome(profissionais[index].nome);
    setCargo(profissionais[index].cargo);
    setEditIndex(index);
  };

  // Função para excluir um profissional
  const handleDelete = (index) => {
    const updatedProfissionais = profissionais.filter((_, i) => i !== index);
    setProfissionais(updatedProfissionais);
    saveData(updatedProfissionais);
  };

  // Carregar os dados ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Gerenciamento de Profissionais</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Cargo"
        value={cargo}
        onChangeText={setCargo}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button title={editIndex !== null ? "Salvar Alterações" : "Adicionar Profissional"} onPress={handleSubmit} />

      <FlatList
        data={profissionais}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text>{item.nome} - {item.cargo}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => handleEdit(index)}>
                <Text style={{ marginRight: 10, color: 'blue' }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(index)}>
                <Text style={{ color: 'red' }}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default App;