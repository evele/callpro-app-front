type data_string = {
    group_id: string
}

export async function downloadContactsFile(data: data_string): Promise<null> {
    try {
        const response = await fetchWrapper.post(GET_DOWNLOAD_CONTACT_FILE, data) ;
        const group_type = data.group_id;        
        const date_string = date_time_to_string();
        
        if (response instanceof  Blob) {
            const blob = response;
            const filename = `${group_type}-${'contacts'}-${date_string}${'.csv'}`;            

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            console.error('The response is not a Blob.');
        }        
    } catch (error) {
        console.error('Error processing the file download:', error);
    }
    return null;// TODO me tiraba error, busque y encontre esta solucion    
}