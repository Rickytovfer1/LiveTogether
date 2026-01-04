package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Vivienda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IViviendaRepositorio extends JpaRepository<Vivienda, Integer> {
    List<Vivienda> findByComunidad_Id(Integer idComunidad);
}
