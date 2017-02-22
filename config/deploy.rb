#========================
#CONFIG
#========================
set :application, "blobber.io"
#========================
#CONFIG
#========================
require           "capistrano-offroad"
offroad_modules   "defaults", "supervisord"
set :repository,  "git@github.com:pomeo/blobber.git"
set :user, "blobber"
set :port, 22
set :supervisord_start_group, "app"
set :supervisord_stop_group,  "app"
set :deploy_to,   "/home/blobber/www"
set :deploy_user, "blobber"
set :deploy_group,"blobber"
#========================
#ROLES
#========================
role :app,        "blobber.io"
#role :app,        "other server"

namespace :deploy do
  desc "Install node modules non-globally"
  task :npm_install do
    run ". /home/blobber/.nvm/nvm.sh && cd #{current_path} && npm install"
  end

  desc "Webpack build"
  task :webpack do
    run ". /home/blobber/.nvm/nvm.sh && cd #{current_path} && npm run build"
  end

  desc "Babel cache"
  task :babel do
    run "rm #{shared_path}/babel.json && touch #{shared_path}/babel.json && chmod 777 #{shared_path}/babel.json"
  end
end

after "deploy:create_symlink",
      "deploy:npm_install",
      "deploy:webpack",
      "deploy:babel",
      "deploy:cleanup",
      "deploy:restart"
