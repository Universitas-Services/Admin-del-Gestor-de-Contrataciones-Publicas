import { describe, it, expect } from 'vitest';

describe('Setup de Vitest', () => {
  it('debería ejecutar las pruebas correctamente', () => {
    // Esta prueba simplemente verifica que el entorno de test funciona
    expect(true).toBe(true);
  });

  it('debería sumar números correctamente', () => {
    const suma = 1 + 1;
    expect(suma).toBe(2);
  });
});
