package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;
import org.example.backendlivetogether.Enumerados.TipoNotificacion;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "notificacion")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Notificacion {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "tipo", nullable = false)
    private TipoNotificacion tipo;

    @ManyToMany
    @JoinTable(
            name = "notificaciones_vecinos",
            joinColumns = @JoinColumn(name = "id_notificacion"),
            inverseJoinColumns = @JoinColumn(name = "id_vecino")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Vecino> vecinos = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "id_comunidad", nullable = false)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Comunidad comunidad;
}
