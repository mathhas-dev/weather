import { renderRoutes } from "react-router-config"
import config from './config'

const { routes } = config

const Modulo = () => renderRoutes(routes)

export default Modulo
