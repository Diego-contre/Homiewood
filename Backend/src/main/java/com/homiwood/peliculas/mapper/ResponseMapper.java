package com.homiwood.peliculas.mapper;

import com.homiwood.peliculas.dto.ContenidoResponse;
import com.homiwood.peliculas.dto.ListaContenidoResponse;
import com.homiwood.peliculas.dto.ListaResponse;
import com.homiwood.peliculas.dto.UsuarioResponse;
import com.homiwood.peliculas.model.Contenido;
import com.homiwood.peliculas.model.Lista;
import com.homiwood.peliculas.model.ListaContenido;
import com.homiwood.peliculas.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class ResponseMapper {

    public UsuarioResponse toUsuarioResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getFechaCreacion()
        );
    }

    public ContenidoResponse toContenidoResponse(Contenido contenido) {
        return new ContenidoResponse(
                contenido.getIdContenido(),
                contenido.getTitulo(),
                contenido.getTipoContenido(),
                contenido.getDescripcion(),
                contenido.getAnioEstreno(),
                contenido.getFechaEstreno(),
                contenido.getDuracionMinutos(),
                contenido.getClasificacionEdad(),
                contenido.getPosterUrl(),
                contenido.getPais(),
                contenido.getIdioma(),
                contenido.getApiProvider(),
                contenido.getApiId()
        );
    }

    public ListaResponse toListaResponse(Lista lista) {
        return new ListaResponse(
                lista.getIdLista(),
                lista.getTitulo(),
                lista.getDescripcion(),
                lista.getVisibilidad(),
                lista.getFechaCreacion(),
                lista.getFechaActualizacion(),
                lista.getUsuario().getIdUsuario(),
                lista.getUsuario().getNombre(),
                lista.getUsuario().getUsername()
        );
    }

    public ListaContenidoResponse toListaContenidoResponse(ListaContenido listaContenido) {
        return new ListaContenidoResponse(
                listaContenido.getIdListaContenido(),
                listaContenido.getLista().getIdLista(),
                listaContenido.getLista().getTitulo(),
                listaContenido.getContenido().getIdContenido(),
                listaContenido.getContenido().getTitulo(),
                listaContenido.getContenido().getTipoContenido(),
                listaContenido.getContenido().getAnioEstreno(),
                listaContenido.getContenido().getPosterUrl(),
                listaContenido.getPosicion(),
                listaContenido.getEstado(),
                listaContenido.getNotaUsuario(),
                listaContenido.getFechaAgregado()
        );
    }
}