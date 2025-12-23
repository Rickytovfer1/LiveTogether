package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vivienda")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Vivienda {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero_residentes", nullable = false)
    private Integer numResidentes;

    @Column(name = "direccion_personal", nullable = false)
    private String direccionPersonal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propietario")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Vecino propietario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Comunidad comunidad;

    @ManyToMany(mappedBy = "viviendas",
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Vecino> vecinos = new HashSet<>(0);

}
