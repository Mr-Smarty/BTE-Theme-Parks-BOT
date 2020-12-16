exports.run = (apiKey, client) => {
    let options = {
        method: 'GET',
        headers: {
            Host: 'buildtheearth.net',
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json'    
        }
    }

    return new Promise((resolve, reject) => {
        client.fetch('https://buildtheearth.net/api/v1/members', options).then(res => res.text()).then(body => {
            let returns = [];
            JSON.parse(body).members.forEach(element => {
                returns.push(element.discordTag);
            });
            resolve(returns);
        }).catch(err => reject(err));
    });
}