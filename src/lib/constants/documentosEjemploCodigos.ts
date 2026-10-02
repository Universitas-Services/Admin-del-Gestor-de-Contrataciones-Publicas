export type DocumentoEjemploSobre = 1 | 2;

export interface DocumentoEjemploCodigoDef {
  codigo: string;
  nombre: string;
  sobre: DocumentoEjemploSobre;
  esSustituto?: boolean;
}

/**
 * Convierte el `id` camelCase del recaudo en el Gestor al `codigo` kebab-case
 * que exige el API (`/documentos-ejemplo`).
 * Ej: modCartaOfertaAuAu → mod-carta-oferta-au-au
 */
export function recaudoIdToDocumentoCodigo(id: string): string {
  return id
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Códigos en kebab-case (regla del backend: minúsculas, números y guiones).
 * Derivados 1:1 de los `id` de recaudos en el Gestor (calificacionLegal.ts).
 */
export const DOCUMENTOS_EJEMPLO_CODIGOS: DocumentoEjemploCodigoDef[] = [
  // Sobre 1
  {
    codigo: 'mod-carta-manifestacion-voluntad-au-au',
    nombre: 'Carta de Manifestación de Voluntad',
    sobre: 1,
  },
  {
    codigo: 'mod-carta-autorizacion-au-au',
    nombre:
      'Poder debidamente autenticado o Autorización simple a la persona encargada de representar a la empresa',
    sobre: 1,
  },
  {
    codigo: 'mod-doc-constitutivo-au-au',
    nombre: 'Documento Constitutivo y Estatutario y sus modificaciones',
    sobre: 1,
  },
  {
    codigo: 'mod-copia-rif-vigente-au-au',
    nombre: 'Copia del Registro de Información Fiscal (R.I.F.)',
    sobre: 1,
  },
  {
    codigo: 'sustituto-dj-rif-vigente-au-au',
    nombre: 'Declaración Jurada sustituto del R.I.F.',
    sobre: 1,
    esSustituto: true,
  },
  {
    codigo: 'mod-certificado-rnc-au-au',
    nombre:
      'Certificado de Inscripción en el Registro Nacional de Contratistas',
    sobre: 1,
  },
  {
    codigo: 'sustituto-dj-certificado-rnc-au-au',
    nombre: 'Declaración Jurada sustituto del R.N.C.',
    sobre: 1,
    esSustituto: true,
  },
  {
    codigo: 'mod-solvencia-laboral-au-au',
    nombre: 'Declaración jurada de Solvencia Laboral',
    sobre: 1,
  },
  {
    codigo: 'mod-declaracion-socios-no-inhabilitados-au-au',
    nombre: 'Declaración Jurada de socios no inhabilitados',
    sobre: 1,
  },
  {
    codigo: 'mod-declaracion-no-deudas-ente-au-au',
    nombre:
      'Declaración Jurada de no poseer Obligaciones Exigibles con el Contratante',
    sobre: 1,
  },
  {
    codigo: 'mod-declaracion-no-impedimentos-lcp-au-au',
    nombre: 'Declaración Jurada de No Tener Impedimentos para Participar (LCP)',
    sobre: 1,
  },
  {
    codigo: 'mod-declaracion-conocimiento-lugar-au-au',
    nombre:
      'Declaración Jurada de Conocimiento del Lugar de Ejecución del Objeto',
    sobre: 1,
  },
  {
    codigo: 'mod-declaracion-info-financiera-au-au',
    nombre: 'Declaración Jurada de Información Financiera',
    sobre: 1,
  },
  {
    codigo: 'mod-evaluacion-desempeno-au-au',
    nombre: 'Informe de Evaluación de desempeño en Contrataciones',
    sobre: 1,
  },
  {
    codigo: 'sustituto-dj-eval-desempeno-au-au',
    nombre: 'Declaración Jurada sustituto de Evaluación de desempeño',
    sobre: 1,
    esSustituto: true,
  },
  // Sobre 2
  {
    codigo: 'mod-carta-oferta-au-au',
    nombre: 'Carta Oferta',
    sobre: 2,
  },
  {
    codigo: 'mod-declaracion-capacidad-financiera-au-au',
    nombre: 'Declaración Jurada de Capacidad Financiera de Contratación',
    sobre: 2,
  },
  {
    codigo: 'mod-declaracion-compromiso-resp-social-au-au',
    nombre:
      'Declaración jurada para el cumplimiento del compromiso de responsabilidad social',
    sobre: 2,
  },
  {
    codigo: 'mod-garantia-mantenimiento-oferta-au-au',
    nombre: 'Garantía de mantenimiento de la Oferta',
    sobre: 2,
  },
  {
    codigo: 'mod-declaracion-autocalculo-van-au-au',
    nombre: 'Declaración Jurada de Auto cálculo del V.A.N.',
    sobre: 2,
  },
  {
    codigo: 'mod-carta-notificaciones-au-au',
    nombre: 'Carta de datos para notificaciones',
    sobre: 2,
  },
  {
    codigo: 'mod-garantia-fiel-cumpl-au-au',
    nombre: 'Garantía de Fiel Cumplimiento del Contrato',
    sobre: 2,
  },
  {
    codigo: 'mod-fianza-laboral-au-au',
    nombre: 'Fianza Laboral',
    sobre: 2,
  },
];

export function findDocumentoEjemploCodigo(
  codigo: string
): DocumentoEjemploCodigoDef | undefined {
  return DOCUMENTOS_EJEMPLO_CODIGOS.find((item) => item.codigo === codigo);
}
