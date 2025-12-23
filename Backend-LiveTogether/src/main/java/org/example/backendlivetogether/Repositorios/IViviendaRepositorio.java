package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Vivienda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IViviendaRepositorio extends JpaRepository<Vivienda, Integer> {
}
