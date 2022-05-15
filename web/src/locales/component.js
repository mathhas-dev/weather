import React from 'react'
import { i18n } from './i18n'
import { Flag } from 'semantic-ui-react'
import { userStore } from 'stores'

const SelectLanguage = () => {
    const handleChangeLanguage = prop => (e) => {
        e.preventDefault();
        userStore.setPreferredLanguage({ "language": prop })
        window.location.reload();
    }
    return (
        <>
            <a onClick={handleChangeLanguage('PORTUGUES')}>
                <Flag name="br" />
            </a>
               <a onClick={handleChangeLanguage('ENGLISH')}>
                <Flag name="us" />
            </a>
            <a onClick={handleChangeLanguage('ESPANOL')}>
                <Flag name="es" />
            </a>
        </>)
}

export default SelectLanguage