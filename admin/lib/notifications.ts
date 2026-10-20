export async function confirmAction(title: string, description: string, destructive = false): Promise<boolean> {
  const { default: Swal } = await import('sweetalert2');
  const result = await Swal.fire({
    title,
    text: description,
    icon: destructive ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: destructive ? 'Sí, continuar' : 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: destructive ? '#c2414a' : '#008c67',
    reverseButtons: true,
  });
  return result.isConfirmed;
}

export async function showToast(kind: 'success' | 'error', message: string): Promise<void> {
  const { default: toastr } = await import('toastr');
  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: kind === 'error' ? 7000 : 4000,
  };
  toastr[kind](message);
}
