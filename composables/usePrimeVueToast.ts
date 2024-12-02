
export function usePrimeVueToast() {
    const toast = useToast();

    const show_success_toast = (title: string, message: string) => {
        toast.add({ 
            severity: 'success', 
            summary: title, 
            detail: message, 
            life: 3000 
        });
    };

    const show_error_toast = (title: string, error: string) => {
        toast.add({ 
            severity: 'error', 
            summary: title, 
            detail: error, 
            life: 3000 
        });
    };

    return { show_success_toast, show_error_toast };
}