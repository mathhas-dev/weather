import React from 'react';
import { Rest } from 'application/rest';
import { observable, action } from 'mobx';
import { weatherStore } from './Weather';

const setCityCache = (value) =>
    window.localStorage.setItem("city", value)

const doList = async () => {
    const rest = new Rest('weather/list_cities');
    rest.api = 'weather/api';
    const response = await rest.list();
    return await response.json();
}

const cityStore = observable({
    list: [],
    city: '',
    loading: false,
    message: null,
    reload: function () {
        const that = this;
        this.loading = true;
        doList().then(response => {
            that.list = response;
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            that.loading = false;
        });
    },
    setCity: function (woeid) {
        // This method set chosen city in the local storage
        // Always that user reload page, will check if have some city (weatherStore.getByGEOIP())
        // to recharge page according to the last choice
        this.city = woeid;
        setCityCache(woeid);
        weatherStore.getByWOEID(woeid);
    },

}, {
    reload: action
});


export { cityStore };