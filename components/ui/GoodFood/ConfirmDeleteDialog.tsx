import React from "react";
import { Button } from "@/components/ui/shadcn/button";
interface ConfirmDeleteDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
}
const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
      <p className="text-sm text-gray-600 mb-6">
        Êtes-vous sûr de vouloir supprimer cet élément ?
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Supprimer
        </Button>
      </div>
    </div>
  </div>
);
export default ConfirmDeleteDialog;
