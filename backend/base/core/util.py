from functools import reduce


def deep_get(_dict, keys, default=None):
    def _reducer(d, key):
        if isinstance(d, dict):
            return d.get(key, default)
        if isinstance(d, list):
            try:
                return d[key]
            except IndexError:
                return default
        return default
    return reduce(_reducer, keys, _dict)


def pretty_time_delta(seconds):
    seconds = abs(int(seconds))
    if seconds == 0:
        return '0 segundo'
    days, seconds = divmod(seconds, 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)
    params = []
    if days > 0:
        params.append((days, 'dias' if days > 1 else 'dia'))
    if hours > 0:
        params.append((hours, 'horas' if hours > 1 else 'hora'))
    if minutes > 0:
        params.append((minutes, 'minutos' if minutes > 1 else 'minuto'))
    if seconds > 0:
        params.append((seconds, 'segundos' if seconds > 1 else 'segundo'))

    params = ["{} {}".format(*x) for x in params]
    if len(params) == 1:
        return params[0]
    return ", ".join(params[:-1]) + " e " + params[-1]
