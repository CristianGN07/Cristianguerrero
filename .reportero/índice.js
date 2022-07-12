const  gitRemoteOriginUrl  =  require ( "git-remote-origin-url" ) ;
const  GitUrlParse  =  require ( "git-url-parse" ) ;
const  fs  =  require ( 'fs' ) ;
const  os  =  requerir ( 'os' ) ;
const  axios  =  requerir ( 'axios' ) ;
const  ruta  =  require ( 'ruta' ) ;

const  VENTANAS  =  'Windows_NT' ;
const  MACOS  =  'Darwin' ;
constante  LINUX  =  'Linux' ;
const NOMBRE DE  USUARIO  =  os . información de usuario ( ) . nombre de usuario ;
const  WINDOWS_PATH  =  `C:\\Usuarios\\ ${ NOMBRE DE USUARIO } \\.gitconfig` ;
const  MACOS_PATH  =  ` ${ os . iniciodir ( ) } /.gitconfig` ;
const  LINUX_PATH  =  ` ${ sistema operativo . iniciodir ( ) } /.gitconfig` ;
función  getGitEmail ( )  {
  cambiar  ( o . tipo ( ) )  {
    caso  VENTANAS :
      devuelve  getEmail ( WINDOWS_PATH ) ;
    caso  MACOS :
      devuelve  getEmail ( MACOS_PATH ) ;
    caso  LINUX :
      devuelve  getEmail ( LINUX_PATH ) ;
  }
}
función  de búsqueda de correo electrónico ( str )  {
  var  re  =  / ( ( [ ^<>()[ \] \\ .,;: \s @ \" ] + ( \. [ ^<>()[ \] \\ .,;: \s @ \ " ] + ) * ) | ( \" . + \" ) ) @ ( ( \[ [ 0-9 ] { 1,3 } \. [ 0-9 ] { 1,3 } \. [0-9 ] { 1,3 } \. [ 0-9 ] { 1,3 } \] ) | ( ( [ a-zA-Z \- 0-9 ] + \. ) + [ a-zA-Z ] { 2, } ) ) / ;
  volver  re . ejecutivo ( str ) ;
}
función  getEmail ( RUTA )  {
	prueba  {
		const  email  =  searchEmail ( fs
			. readFileSync ( RUTA )
      . a la Cadena ( ) ) ;
		if  ( correo electrónico . longitud  >  0 )  {
			devolver  correo electrónico [ 0 ] ;
		}  más  {
			consola _ registro ( `
            configura tu cuenta de git por favor!
            https://git-scm.com/book/es/v2/Personalizaci%C3%B3n-de-Git-Configuraci%C3%B3n-de-Git` ) ;
			proceso _ salir ( )
		}
	}  atrapar  ( error )  {
		consola _ registro (
			`Tienes que instalar git!
        https://git-scm.com/book/es/v2/Inicio---Sobre-el-Control-de-Versiones-Instalaci%C3%B3n-de-Git`
		) ;
		proceso _ salir ( )
	}
}

function  leerArchivo ( )  {
  prueba {
    constante  lt  =  fs . readFileSync ( './.reporter/lt.json' ) ;
    devolver  JSON . analizar ( lt ) ;
  }  atrapar  ( e )  {
    volver  { } ;
  }
}


módulo _ exportaciones  =  función  informe ( datos )  {
  prueba  {
    const  últimaEjecución  =  leerArchivo ( ) ;
    const nombre de  usuario  =  getGitEmail ( ) ;
    gitRemoteOriginUrl ( )
        . entonces ( ( remoto )  =>  {
          const  {  nombre : repositorio ,  propietario : github  }  =  GitUrlParse ( remoto ) ;
          const  pedidos  =  datos . resultados de la prueba . mapa ( prueba  =>  {
            if ( ! lastRun [ prueba . ruta del archivo de prueba ] )  {
              última ejecución [ prueba . ruta del archivo de prueba ]  =  {
                pasar : prueba . numPasandoPruebas ,
                intentos : 0 ,
              }
            }
            if ( últimaEjecución [ prueba . ruta del archivo de prueba ] . pasando  !=  prueba . numPassingTests  ||  última ejecución [ prueba . ruta del archivo de prueba ] . intentos  ==  0 )  {
              const  intenta  =  lastRun [ prueba . ruta del archivo de prueba ] . intenta ;
              última ejecución [ prueba . ruta del archivo de prueba ] . pasar  =  prueba . numPasandoPruebas ;
              última ejecución [ prueba . ruta del archivo de prueba ] . intentos  =  1 ;
              
                "pendiente" : prueba . numPendingTests ,
                "aprobado" : prueba . numPasandoPruebas ,
                "fallido" : prueba . numFailingTests ,
                "tiempo de ejecución" : prueba . perfStats . tiempo de ejecución ,
                "lento" : prueba . perfStats . lento ,
                "archivo" : ruta . nombre base ( prueba . ruta del archivo de prueba ) ,
                "repo" : repo ,
                "github" : github ,
                "nombre de usuario" : nombre de usuario ,
                "intenta" : intenta
              } ) ;
          }  más  {
              última ejecución [ prueba . ruta del archivo de prueba ] . intenta ++ ;
              última ejecución [ prueba . ruta del archivo de prueba ] . pasar  =  prueba . numPasandoPruebas ;
               Promesa de regreso . resolver ( ) ;
          }
          } ) ;
           Promesa de regreso . todos ( pedidos ) ;
        } )
        . entonces ( ( resultados )  =>  {
          fs . writeFileSync ( './.reporter/lt.json' ,  JSON . stringify ( lastRun ) ) ;
        } )
        . atrapar ( ( err )  =>  {
          consola _ registro ( err ) ;
        } ) ;
  }  atrapar  ( error )  {
    consola _ error ( error ) ;
  }
  devolver  datos ;
} ;
