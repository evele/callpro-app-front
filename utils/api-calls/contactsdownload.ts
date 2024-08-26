type data_string = {
    group_id: string
}

export async function downloadContactsFile(data: data_string): Promise<null> {
    try {
        const response = await fetchWrapper.post(GET_DOWNLOAD_CONTACT_FILE, data) ;
        const tipo = data.group_id;
        const ahora = new Date();
        const fecha:string = `${ahora.getFullYear()}-${(ahora.getMonth() + 1).toString().padStart(2, '0')}-${ahora.getDate().toString().padStart(2, '0')}`;
        
        if (response instanceof  Blob) {
            const blob = response;
            const filename = `${tipo}-${'contacts'}-${fecha}${'.csv'}`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            console.error('La respuesta no es un Blob.');
        }        
    } catch (error) {
        console.error('Error al procesar la descarga del archivo:', error);
    }
    return null;// TODO me tiraba error, busque y encontre esta solucion    
}