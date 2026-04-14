function openDialogue(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.showModal();
}
  
function closeDialogue(dialogId) {
    const dialog = document.getElementById(dialogId);
    dialog.close();
}

// Close on backdrop click for all dialogs
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });
});