import React from 'react';
import { Rest } from 'application/rest';
import { observable, action } from 'mobx';

import i18n from "i18next";

const doList = async (page = 1) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.query = {
    page
  };
  const response = await rest.list();
  return await response.json();
}

const doGet = async (id) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  const response = await rest.get(id);
  return await response.json();
}

const doGetUnlock = async (id) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.method = 'retrieve_unlock';
  const response = await rest.get(id);
  return await response.json();
}

const doCheckCpf = async (cpf) => {
  const rest = new Rest('user/cpf');
  rest.api = 'access/api';
  const response = await rest.get(cpf);
  return await response.json();
}

const doCreate = async (data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  const response = await rest.post(data);
  return await response.json();
}

const doUpdate = async (id, data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.detail = id;
  const response = await rest.put(data);
  return await response.json();
}

const doRemove = async (id, data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.detail = id;
  const response = await rest.delete(data);
  return await response.json();
}

const doBlock = async (id, data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.method = 'block';
  rest.detail = id;
  const response = await rest.post();
  return await response.json();
}

const doUnlock = async (id, data) => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.method = 'unlock';
  rest.detail = id;
  const response = await rest.post();
  return await response.json();
}

const getProfilesGroup = async () => {
  const rest = new Rest('user');
  rest.api = 'access/api';
  rest.method = 'profiles';
  const response = await rest.list();
  return await response.json();
};

const users = observable({
  list: [],
  user: null,
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
  getUser: async function (idUser) {
    const rest = new Rest('user');
    rest.api = 'access/api';
    const response = await rest.get(idUser);
    this.user = await response.json();
    return this.user.name
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
  remove: async function (id) {
    try {
      this.removing = true;
      await doRemove(id);
      this.reload();
      this.message = {
        content: i18n.t("User removed successfully."),
        success: true
      };
    } catch (error) {
      this.message = {
        content: i18n.t("Error removing user: ") + error + ".",
        error: true
      };
    } finally {
      this.removing = false;
    }
  },
  block: async function (id) {
    try {
      this.blocking = true;
      await doBlock(id);
      this.reload();
      this.message = {
        content: i18n.t("User blocked successfully."),
        success: true
      };
    } catch (error) {
      this.message = {
        content: i18n.t("Error blocking user: ") + error + ".",
        error: true
      };
    } finally {
      this.blocking = false;
    }

  }
}, {
  remove: action,
  reload: action,
  block: action,
  getUser: action,
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

const userStore = observable({
  _id: null,
  dados: {
    name: '',
    email: '',
    phone: null,
    country_code_number: null,
    username: '',
    profile: '',
    profiles: []
  },
  searching: false,
  loading: false,
  saving: false,
  message: null,
  error: null,
  reset: function () {
    this._id = null;
    this.dados = {
      name: '',
      email: '',
      phone: null,
      country_code_number: null,
      username: '',
      profile: '',
      profiles: []
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
  save: async function () {
    this.saving = true;
    const create = this.id === null;
    try {
      let response;
      if (this.id) {
        response = await doUpdate(this.id, this.dados);
      } else {
        response = await doCreate(this.dados);
        this.id = response.id;
      }
      this.dados = response;
      this.message = {
        content: create ?
          i18n.t("User registered successfully.") :
          i18n.t("User updated successfully."),
        success: true
      };
      this.error = null;
    } catch (error) {
      this.error = error;
      if (error.toString() === 'SyntaxError: Unexpected token E in JSON at position 0') {
        this.message = {
          content: create ?
            i18n.t("Error when registering user, CPF already registered in our database.") :
            i18n.t("Error updating user."),
          error: true,
        };
      } else {
        this.message = {
          content: create ?
            i18n.t("Error registering user.") :
            i18n.t("Error updating user."),
          error: true,
        };
      }
    } finally {
      this.saving = false;
    }
  },
  getUnlock: async function (id) {
    this._id = id;
    this.loading = true;
    try {
      this.dados = await doGetUnlock(id);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false
    }
  },
  unlock: async function () {
    try {
      this.saving = true;
      await doUnlock(this.id);
      this.message = {
        content: i18n.t("User unlocked."),
        success: true
      };
    } catch (error) {
      this.error = error;
      this.message = {
        content: i18n.t("Error unlocking user."),
        error: true
      };
    } finally {
      this.saving = false;
    }
  }, checkCpf: action(async function (cpf) {
    this.error = null;
    cpf = cpf.replace(/[^0-9]/g, '');
    if (cpf.length !== 11) {
      this.error = {
        username: 'Invalid CPF format.'
      };
      return;
    }
    try {
      this.searching = true;
      const response = await doCheckCpf(cpf);
      this.dados.name = response.nome;
      this.dados.email = response.email;
    } catch (error) {
      this.error = error;
      if (error.hasOwnProperty('cpf'))
        this.error['username'] = this.error['cpf'];
      if (error.hasOwnProperty('detail')) {
        this.message = {
          content: error.detail,
          error: true
        };
      }
    } finally {
      this.searching = false;
    }
  })
}, {
  save: action,
  unlock: action,
  getUnlock: action,
  reset: action,
});

const userDomain = observable({
  profiles: [],
  search_managed_profiles: action(async function () {
    const json = await getProfilesGroup();
    this.profiles = json;
  }),
  get_profile: function (id) {
    return this.profiles.find(profile => profile.id === id);
  },
});

export { users, userStore, userDomain };
