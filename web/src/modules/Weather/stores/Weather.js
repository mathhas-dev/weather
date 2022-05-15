import React from 'react';
import { Rest } from 'application/rest';
import { observable, action } from 'mobx';
import i18n from "i18next";

const doGet = async (id) => {
    const rest = new Rest('weather');
    rest.api = 'weather/api';
    const response = await rest.get(id);
    return await response.json();
}

const doGetWOEID = async (woeid = null) => {
    const rest = new Rest('weather/get_weather_from_api_WOEID');
    rest.api = 'weather/api';
    const response = await rest.getWithBody(woeid);
    return await response.json();
}

const doGetGEOIP = async () => {
    const rest = new Rest('weather/get_weather_from_api_GEOIP');
    rest.api = 'weather/api';
    const response = await rest.get();
    return await response.json();
}

const getFavoriteWeather = async (id) => {
    const rest = new Rest('weather');
    rest.api = 'weather/api';
    const response = await rest.get(id);
    return await response.json();
}

const parseError = (error) => {
    let content = error
    if (typeof content === 'object') {
        content = []
        for (let key in error) content.push(error.get(key))
    }
    content = Array.isArray(content) ?
        (<>{content.map((text, i) => <span key={i}>{text}<br /></span>)}</>) :
        String(content)
    return { content, pointing: 'above' };
}

const weatherStore = observable({
    _id: null,
    data: {
        city: '',
        woeid: '',
        results: null,
    },
    loading: false,
    message: null,
    error: null,
    reset: function () {
        this._id = null;
        this.data = {
            city: '',
            woeid: '',
            results: null,
        };
        this.message = null;
        this.error = null;
        this.loading = false;
    },
    getError: function (field) {
        return this.error !== null && this.error.hasOwnProperty(field) ?
            parseError(this.error[field]) : null
    },
    set id(id) {
        this.reset();
        if (id) this._id = id
        const that = this;
        doGet(id).then(response => {
            that.dados = response;
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            that.loading = false;
        });
    },
    get id() {
        return this._id;
    },
    getByWOEID: async function (woeid) {
        this.loading = true;
        try {
            const response = await doGetWOEID(woeid);
            this.data = response;
            this.message = {
                content: i18n.t("Weather successfully updated."),
                success: true
            };
            this.error = null;
        } catch (error) {
            this.error = error;
            this.message = {
                content: i18n.t("Error while updating Weather."),
                error: true
            };
        } finally {
            this.saving = false;
        }
    },
    getByGEOIP: async function () {
        this.loading = true;
        try {
            const response = await doGetGEOIP();
            this.data = response;
            this.message = {
                content: i18n.t("Weather successfully updated."),
                success: true
            };
            this.error = null;
        } catch (error) {
            this.error = error;
            this.message = {
                content: i18n.t("Error while updating Weather."),
                error: true
            };
        } finally {
            this.saving = false;
        }
    }
}, {
    reset: action,
});


const weatherDomain = observable({
    weather: [],
    search_weather: action(async function (weather_id) {
        const json = await getFavoriteWeather(weather_id);
        this.weather = json;
    }),
});


export { weatherStore, weatherDomain };