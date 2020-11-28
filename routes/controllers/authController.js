import {bcrypt, validasaur} from "../../deps.js"
import * as authService from "../../services/authService.js"

const validationRules = {
    password: [validasaur.required, validasaur.minLength(4)],
    email: [validasaur.required, validasaur.isEmail],
};

const clearData = (data) => {
    return {
        password: '',
        email: '',
        errors: data.errors
    };
}

const getData = async (request) => {
    const data = {
        password: "",
        email: "",
        errors: []
    };

    if (request) {
        const body = request.body();
        const params = await body.value;
        data.password = params.get("password");
        data.email = params.get("email");
    }

    return data;
};

const showLoginForm =async ({render}) => {
    const data = await getData();
    render('login.ejs', data);
}

const showRegisterForm = async ({render}) => {
    const data = await getData();
    render('register.ejs', data);
}

const authenticate = async ({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    const data = await getData(request);

    // check if the email exists in the database
    const existingUser = await authService.getUser(data.email);
    if (!existingUser) {
        data.errors.push('Invalid email or password');
        render('login.ejs', clearData(data));
    }

    const hash = existingUser.password;

    const passwordCorrect = await bcrypt.compare(data.password, hash);
    if (!passwordCorrect) {
        // response.status = 401;
        // return;
        data.errors.push('Invalid email or password');
        render('login.ejs', clearData(data));
    }

    await session.set('authenticated', true);
    await session.set('user', {
        id: existingUser.id,
        email: existingUser.email
    });

    response.redirect('/behavior/reporting');
}

const register = async ({request, response, render, session}) => {
    const body = request.body();
    const params = await body.value;

    const data = await getData(request);
    const verification = params.get('password-verification');

    //validation
    const [passes, errors] = await validasaur.validate({
        password: data.password,
        email: data.email
    }, validationRules);

    Object.keys(errors).forEach((attribute) => {
        Object.values(errors[attribute]).forEach((err) => {
            data.errors.push(err)
        })
    });

    if (!passes) {
        render('register.ejs', clearData(data));
        return;
    }

    if (data.password !== verification) {
        data.errors.push('The entered passwords did not match');
        render('register.ejs', clearData(data));
        return;
    }

    // if (data.password.length < 4) {
    //     data.errors.push('Password should be more then 4 symbols');
    //     render('register.ejs', clearData(data));
    //     return;
    // }

    // check if there already exists such an email in the database
    // -- if yes, respond with a message telling that the user
    // already exists

    const existingUser = await authService.getUser(data.email);
    if (existingUser) {
        data.errors.push('The email is already reserved');
        render('register.ejs', clearData(data));
        return;
    }

    // otherwise, store the details in the database
    const hash = await bcrypt.hash(data.password);
    const id = await authService.createUser(data.email, hash);
    await session.set('authenticated', true);
    await session.set('user', {
        id: id,
        email: data.email
    });

    response.redirect('/behavior/reporting');
};

const logout = async ({response, session}) => {
    await session.set('authenticated', false);
    await session.set('user', null);
    response.redirect('/auth/login');
}

export {showLoginForm, showRegisterForm, authenticate, register, logout};