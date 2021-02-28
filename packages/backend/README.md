# `backend`

## Description

Running on port `3000`, has an available swagger API on the routue `/swagger`. This backend connects to 2 microservices: `subscriptions` and `mails` to do operations with subscriptions (CRUD) and then send email notifications (currently mocked).

Also contains an `auth` module with a simple `register/login` with `username` and `password` to have the `subscriptions` endpoints actually protected by a simple JWT.

For details on how to run the project, see the general `README`.
