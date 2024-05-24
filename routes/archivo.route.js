import { Router } from 'express'
import { writeFile, readFile, rename, unlink } from 'fs/promises';
import path from 'path'
import slugify from 'slugify';

const router = Router();

const __dirname = import.meta.dirname;

// PATH /archivos
router.get('/', (req, res) => {

    // query params query string
    const { success, error } = req.query

    return res.render('archivos' , {success, error});
});

// crear los archivos
router.post('/crear', async (req, res) => {

    try {

        const nombreArchivo = req.body.archivo;
        const contenidoArchivo = req.body.contenido;
    
        if(!nombreArchivo || !contenidoArchivo || !nombreArchivo.trim() || !contenidoArchivo.trim()){
            console.log('Todos los campos obligatorios');
            return res.status(400).redirect('/archivos?error=todos los campos son obligatorios');
        }

        const slug = slugify(nombreArchivo, {
            strict: true,
            lower : true,
            trim: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);
        // crear un archivo
        await writeFile(ruta, contenidoArchivo);
        return res.status(201).redirect('/archivos?success=se creo el archivo con éxito');
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/archivos?error=error al crear el archivo');
    }
});

router.get('/leer', async (req, res) => {
    try {
        const { archivo } = req.query

        const slug = slugify(archivo, {
            strict: true,
            lower : true,
            trim: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);
        const contenido = await readFile(ruta, 'utf-8')

        return res.redirect('/archivos?success=' + contenido);
        
    } catch (error) {
        console.log(error);
        if(error.code === 'ENOENT'){
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo');
        }
        return res.status(500).redirect('/archivos?error=error al leer el archivo');
    }
});

router.post('/renombrar', async (req, res) => {
    try {
        const { archivo, nuevoNombre } = req.body

        const slug = slugify(archivo, {
            strict: true,
            lower : true,
            trim: true
        })

        const nuevoSlug = slugify(nuevoNombre, {
            strict: true,
            lower : true,
            trim: true
        })

        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);
        const nuevaRuta = path.join(__dirname, `../data/archivos/${nuevoSlug}.txt`);

        await rename(ruta , nuevaRuta)

        return res.status(200).redirect('/archivos?success= Se renombro con éxito el archivo');
        
    } catch (error) {
        console.log(error);
        if(error.code === 'ENOENT'){
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo');
        }
        return res.status(500).redirect('/archivos?error=error al renombar el archivo');
    }
});


router.post('/eliminar', async (req, res) => {
    try {
        const { archivo } = req.body

        const slug = slugify(archivo, {
            strict: true,
            lower : true,
            trim: true
        })
  
        const ruta = path.join(__dirname, `../data/archivos/${slug}.txt`);

        await unlink(ruta)

        return res.status(200).redirect('/archivos?success= Se elimino con éxito el archivo');
        
    } catch (error) {
        console.log(error);
        if(error.code === 'ENOENT'){
            return res.status(404).redirect('/archivos?error=No se encuentra este archivo');
        }
        return res.status(500).redirect('/archivos?error=error al renombar el archivo');
    }
});

export default router;