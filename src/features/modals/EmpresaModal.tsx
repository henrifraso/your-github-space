// EmpresaModal — modal de informações da empresa.
//
// Bottom modal (mobile) / centered modal que mostra metadados da empresa
// (nome fantasia, segmento, cidade/estado, telefone, nível, pontos, semana).
//
// Conteúdo movido de src/App.tsx (Fase 18) byte-a-byte. JSX, classes e
// rótulos preservados. Recebe `data` no mesmo shape que `OmniData` para
// não acoplar este componente ao state global do App.

import { Info } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { BottomModal, ModalHeader } from '../../components/BottomModal';

interface EmpresaModalData {
  negocio: {
    nome_fantasia: string;
    segmento: string;
    cidade: string;
    estado: string;
    telefone: string;
    nivel: number | string;
    pontos: number | string;
  };
  nivel_label: string;
  semana_label: string;
}

interface EmpresaModalProps {
  open: boolean;
  onClose: () => void;
  data: EmpresaModalData;
}

export function EmpresaModal({ open, onClose, data }: EmpresaModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <BottomModal onClose={onClose}>
          <ModalHeader onClose={onClose}><Info size={18} className="text-[#3b82f6]" /><h2 className="text-base font-bold">Empresa</h2></ModalHeader>
          <div className="space-y-0">
            {[{label:'Nome',value:data.negocio.nome_fantasia},{label:'Segmento',value:data.negocio.segmento},{label:'Cidade',value:`${data.negocio.cidade}, ${data.negocio.estado}`},{label:'Telefone',value:data.negocio.telefone},{label:'Nível',value:`${data.nivel_label} (Nível ${data.negocio.nivel})`},{label:'Pontos',value:`${data.negocio.pontos} pts`},{label:'Semana',value:data.semana_label}].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-[#414141] last:border-0">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">{item.label}</span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-300">{item.value}</span>
              </div>
            ))}
          </div>
        </BottomModal>
      )}
    </AnimatePresence>
  );
}
