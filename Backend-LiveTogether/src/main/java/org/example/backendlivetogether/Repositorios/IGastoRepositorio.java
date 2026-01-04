package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IGastoRepositorio extends JpaRepository<Gasto, Integer> {
}
