import React from 'react';
import { Rest } from 'application/rest';
import { observable, action } from 'mobx';

import i18n from "i18next";

const doList = async (page = 1) => {
    const rest = new Rest('weather');
    rest.api = 'weather_application/api';
    rest.query = {
        page
    };
    const response = await rest.list();
    return await response.json();
}

const doGet = async (id) => {
    const rest = new Rest('weather');
    rest.api = 'weather_application/api';
    const response = await rest.get(id);
    return await response.json();
}

const doUpdate = async (id, data) => {
    const rest = new Rest('weather');
    rest.api = 'weather_application/api';
    rest.detail = id;
    const response = await rest.put(data);
    return await response.json();
}

const getFavoriteWeather = async (id) => {
    const rest = new Rest('weather');
    rest.api = 'weather_application/api';
    const response = await rest.get(id);
    return await response.json();
}


const weathers = observable({
    list: [],
    loading: false,
    removing: false,
    blocking: false,
    message: null,
    can_update: false,
    can_retrieve: false,
    can_destroy: false,
    pagination: {
        totalPages: 0,
        activePage: 1,
        onPageChange: () => { }
    },
    get page() {
        return this.pagination.activePage;
    },
    set page(newPage) {
        this.message = null;
        this.reload(newPage);
    },
    reload: function (page = null) {
        if (page === null) page = this.page;
        const that = this;
        this.loading = true;
        doList(page).then(response => {
            that.list = response.results;
            that.pagination = {
                totalPages: response.num_pages,
                activePage: response.page,
                onPageChange: (e, me) => {
                    that.page = me.activePage;
                }
            }
            that.can_update = response.can_update;
            that.can_retrieve = response.can_retrieve;
            that.can_destroy = response.can_destroy;
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            that.loading = false;
        });
    },
}, {
    reload: action,
});

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
    dados: {
        uuid: '',
        id: '',
        name: '',
        type: '',
        grade_type: '',
        questions: []
    },
    searching: false,
    loading: false,
    saving: false,
    message: null,
    error: null,
    reset: function () {
        this._id = null;
        this.dados = {
            uuid: '',
            id: '',
            name: '',
            type: '',
            grade_type: '',
            questions: []
        };
        this.message = null;
        this.error = null;
        this.saving = false;
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
    getById: async function (id) {
        this.reset();
        const that = this;
        doGet(id).then(response => {
            that.dados = response;
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            that.loading = false;
        });
    },
    update: async function () {
        this.saving = true;
        const create = this.id === null;
        try {
            const response = await doUpdate(this.id, this.dados);
            this.dados = response;
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
}, {
    update: action,
    reset: action,
});


const weatherDomain = observable({
    weather: [],
    search_weather: action(async function (weather_id) {
        const json = await getFavoriteWeather(weather_id);
        this.weather = json;
    }),
});


export { weathers, weatherStore, weatherDomain };