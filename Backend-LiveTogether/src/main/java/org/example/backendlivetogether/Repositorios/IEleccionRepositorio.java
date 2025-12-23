package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Eleccion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IEleccionRepositorio extends JpaRepository<Eleccion, Integer> {
}
