//import mapper from 'json-mapper-json';

export async function convert(prefix: any, data: any, event?: any) {
  try {
    data.event = event || data.event;
    event = data.event.indexOf('message') >= 0 ? 'message' : data.event;

    let mappConfEvent = await config_event(prefix, event);
    let mappConfType = await config_type(prefix, event, data.type);

    Object.assign(mappConfEvent, mappConfType);

    // console.log('mappConfEvent', mappConfEvent);

    if (!mappConfEvent) return data;
    //return await mapper(data, mappConfEvent);
  } catch (e) {
    return data;
  }
}

async function config_event(prefix: any, event: any) {
  try {
    let { default: mappConf } = await import(`./${prefix}${event}.js`);
    if (!mappConf) return undefined;
    return mappConf;
  } catch (e) {
    return undefined;
  }
}

async function config_type(prefix: any, event: any, type: any) {
  try {
    let { default: mappConf } = await import(`./${prefix}${event}-${type}.js`);
    if (!mappConf) return undefined;
    return mappConf;
  } catch (e) {
    return undefined;
  }
}