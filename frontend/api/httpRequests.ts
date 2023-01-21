const url = "http://192.168.178.52:8080/tour-app/tours";
export let userId = "Felix";

export async function post(path: string, body: any) {
    let response = await fetch(url + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function get(path: string) {
    let response = await fetch(url + path);
    return await response.json();
}

export async function put(path: string, body: any) {
    let response = await fetch(url + path, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}

export async function patch(path: string, body: any) {
    let response = await fetch(url + path, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    return await response.json();
}
