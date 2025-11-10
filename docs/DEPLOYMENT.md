# The deployment of this application

This application and it's own database are deployed on the university servers with Apache2.

## CI/CD

This project have an automatic deployment pipeline using Github Action. You can check the script pipeline on `.github/workflows/deploy.yml`.
The deployment are trigger when a change are pushed or merged to `main` branch.

- Currently, the pushs from your local to main branche are restrincted and the only way to merge/push changes to main branch is from a Pull Request on Github; and must add 1 reviewer at least to merge the Pull Request.

## How to deploy from scratch

If the CI/CD has an error, you can deploy the application manually directly on the university server. (You should have credentials to access to the server remotely, and some necessary rights to do some steps).

Steps:

1. Make sure that the database are up to date with the latest changes on the repo. (Prisma schemes, migrations, etc.)
2. Verify the `.env` variables are correct.
3. Access to apache folders where the source code are hosted. Should be: `/var/www/upqroo-bolsa-empleo`
4. Check that you are on the main branch and pull latest changes. (`git pull origin main`)
5. Update the database if there any changes on the schemas or new migrations with `npx prisma db push`.
6. Generate the build files with `npm run build`
7. Restart the pm2 process of the project `bolsa-upqroo` (If you can't see the process on the pm2 process list with command `pm2 list`, please contact with the server administrator to restart the pm2 or asks to update your credential rights)
8. Verify that the page was deployed correctly on the webpage `redtalento.upqroo.edu.mx`
