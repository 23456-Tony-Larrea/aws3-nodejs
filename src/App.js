import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import './App.css'; // Importa los estilos

function App() {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useRef(null);

  useEffect(() => {
    axios.get('https://aws-node.onrender.com/files')
      .then(response => {
        console.log(response.data);
        setFiles(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los archivos:', error);
      });
  }, []);

  const getFileURL = async fileName => {
    const response = await axios.get(`https://aws-node.onrender.com/files/${fileName}`);
    return response.data.url; // Devuelve la URL del archivo
  };

  const handleUpload = async () => {
    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('https://aws-node.onrender.com/files', formData);
      const response = await axios.get('https://aws-node.onrender.com/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleDownload = async fileName => {
    try {
      await axios.get(`https://aws-node.onrender.com/downloadfile/${fileName}`);
      console.log('Archivo descargado');
      toast.current.show({severity:'success', summary: 'Descargado', detail:'El archivo ha sido descargado', life: 3000});
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button label="Descargar" icon="pi pi-download" onClick={async () => window.open(await getFileURL(rowData.Key), "_blank")} className="p-button-warning" />
        <Button label="Ver" icon="pi pi-eye " onClick={() => handleDownload(rowData.Key)} className="p-button-info" />
      </React.Fragment>
    );
  }

  return (
    <div className="app-container">
      <h1 className="title">AWS3 Proyecto Final</h1>
      <Toast ref={toast} />
      <div className="upload-container">
        <input type="file" ref={fileInputRef} />
        <Button label="Subir" icon="pi pi-upload" onClick={handleUpload} className="p-button-success upload-button" />
      </div>
      <DataTable value={files}>
        <Column field="Key" header="Nombre del archivo"></Column>
        <Column field="LastModified" header="Última modificación"></Column>
        <Column field="Size" header="Tamaño"></Column>
        <Column body={actionBodyTemplate} header="Acciones"></Column>
      </DataTable>
    </div>
  );
}

export default App;