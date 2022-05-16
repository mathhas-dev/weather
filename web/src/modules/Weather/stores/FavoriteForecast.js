import React from 'react';
import { Rest } from 'application/rest';
import { observable, action } from 'mobx';
import i18n from "i18next";

const doList = async () => {
    const rest = new Rest('weather/list_favorite_forecasts');
    rest.api = 'weather/api';
    const response = await rest.list();
    return await response.json();
}

const doCreate = async (id) => {
    const rest = new Rest('weather/save_favorite_forecast');
    rest.api = 'weather/api';
    const data = { "forecast_id": id }
    const response = await rest.post(data);
    return await response.json();
}

const doRemove = async (id) => {
    const rest = new Rest('weather/remove_favorite_forecast');
    rest.api = 'weather/api';
    const data = { "forecast_id": id }
    const response = await rest.put(data);
    return await response.json();
}

const favoriteForecastStore = observable({
    list: [],
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
    remove: async function (id) {
        try {
            this.loading = true;
            await doRemove(id);
            this.reload();
            this.message = {
                content: i18n.t("Favorite removed successfully."),
                success: true
            };
        } catch (error) {
            this.message = {
                content: i18n.t("Error removing: ") + error + ".",
                error: true
            };
        } finally {
            this.loading = false;
        }
    },
    create: async function (id) {
        try {
            this.loading = true;
            await doCreate(id);
            this.reload();
            this.message = {
                content: i18n.t("Favorite created successfully."),
                success: true
            };
        } catch (error) {
            this.message = {
                content: i18n.t("Error creating: ") + error + ".",
                error: true
            };
        } finally {
            this.loading = false;
        }
    },
}, {
    remove: action,
    create: action,
    reload: action
});


export { favoriteForecastStore };