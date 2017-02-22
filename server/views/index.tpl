<div id="fb-root"></div>
<script>
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
</script>
<script>
    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0]
            , t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);
        t._e = [];
        t.ready = function (f) {
            t._e.push(f);
        };
        return t;
    }(document, "script", "twitter-wjs"));
</script>
<div id="gameAreaWrapper" class="uk-hidden">
    {{#user.options.leaderboard}}
    <div id="status"><span class="title">Leaderboard</span></div>
    {{/user.options.leaderboard}}
    {{^user.options.leaderboard}}
    <div id="status" class="uk-hidden"><span class="title">Leaderboard</span></div>
    {{/user.options.leaderboard}}
    <div id="rightBonuses" class="uk-hidden"></div>
    <div id="bottomBonuses" class="uk-hidden"></div>
    <div id="score">Score: 0</div>
    <div id="mass">BlobMass: 0</div>
    <div id="coordinates">x: 0 y: 0</div>
    <div id="mobile">
      <input type="image" id="split" class="split" src="/app/img/split.png" alt="splitBtn">
      <input type="image" id="feed" class="feed" src="/app/img/feed.png" alt="feedBtn">
    </div>
    {{#user.options.chat}}
    <div class="chatbox uk-form" id="chatbox">
      <ul id="chatList" class="chat-list"></ul>
      <input id="chatInput" type="text" class="uk-form-row chat-input" placeholder="Chat here..." maxlength="35" /></div>
    {{/user.options.chat}}
    {{^user.options.chat}}
    <div class="chatbox uk-form uk-hidden" id="chatbox">
        <ul id="chatList" class="chat-list"></ul>
        <input id="chatInput" type="text" class="uk-form-row chat-input" placeholder="Chat here..." maxlength="35" /></div>
    {{/user.options.chat}}
    <canvas tabindex="1" id="cvs" class="uk-height-1-1"></canvas>
</div>
<div id="startMenuWrapper" class="uk-height-1-1 uk-flex uk-flex-center uk-flex-middle">
    <div id="startMenuHello" class="uk-flex uk-flex-center">
        <div id="startMenuLeft" class="uk-hidden">
            <div id="startMenuProfile" class="uk-panel uk-panel-box uk-margin-bottom">
                <article class="uk-comment">
                    <header class="uk-comment-header">
                        <!--  <img class="uk-comment-avatar" src="/app/img/profilepic_guest.png" alt="">
                <h4 class="uk-comment-title">Guest</h4> -->
                        <div id="profileCoins" class="uk-comment-meta uk-margin-top"> <img id="iconCoin" src="/app/img/currency_icon.png" />
                            <p id="profileBalance">10000</p>
                            <a id="plusProfileCoins" href="" data-uk-modal="{target:'#modalAddCoins', center:true}">
                                <svg viewBox="0 0 10 10">
                                    <g>
                                        <circle cx="5" cy="5" r="3" stroke="#55b300" stroke-width="0.5px" fill="#69dd00" />
                                        <text x="50%" y="50%" text-anchor="middle" stroke="white" stroke-width="0.1px" dy=".28em" font-size="5" fill="white">+</text>
                                    </g>
                                </svg>
                            </a>
                        </div>
                    </header>
                    <div class="uk-progress">
                        <div class="uk-progress-bar" style="width: 50%;">25/50</div>
                        <div id="progress-bar-star">1</div>
                    </div>
                </article>
            </div>
            <!--     <div id="startMenuFreeCoins" class="uk-panel uk-panel-box uk-margin-bottom">
            <button id="freecoinsButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success" data-uk-modal="{target:'#modalFreeCoins', center:true}">Free Coins</button>
          </div>  -->
            <div id="startMenuShop" class="uk-panel uk-panel-box uk-margin-bottom">
                <button id="shopButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success" data-uk-modal="{target:'#modalShop', center:true}">Shop</button>
                <div id="shopUnderButton" class="uk-flex uk-margin-top">
                    <div id="shopSkins">
                        <a href="" data-uk-modal="{target:'#modalShopSkins', center:true}">
                            <svg viewBox="0 0 30 30">
                                <g>
                                    <image href="/app/img/robot03.png" x="0" y="0" height="30px" width="30px" />
                                    <!-- <circle cx="15" cy="15" r="12" fill="none" stroke="black" stroke-width="0.3px" />
                      <text x="50%" y="50%" text-anchor="middle" stroke="black" stroke-width="0.1px" dy=".3em" font-size="5" fill="white">Skins</text> -->
                                </g>
                            </svg>
                            <svg id="plusShopSkins" viewBox="0 0 30 30" href="" data-uk-modal="{target:'#modalAddCoins', center:true}">
                                <g>
                                    <circle cx="15" cy="15" r="3" stroke="#55b300" stroke-width="0.5px" fill="#69dd00" />
                                    <text x="50%" y="50%" text-anchor="middle" stroke="white" stroke-width="0.1px" dy=".28em" font-size="5" fill="white">+</text>
                                </g>
                            </svg>
                        </a>
                    </div>
                    <!--        <div id="shopMassXP">
                <div id="shopXPBoost">
                  <a href="" data-uk-modal="{target:'#modalShopXP', center:true}">
                    <img src="/app/img/xpboost_3x_shop.png" />
                    <svg id="plusXPBoost" viewBox="0 0 30 30">
                      <g>
                        <circle cx="15" cy="15" r="3" stroke="#55b300" stroke-width="0.5px" fill="#69dd00" />
                        <text x="50%" y="50%" text-anchor="middle" stroke="white" stroke-width="0.1px" dy=".28em" font-size="5" fill="white">+</text>
                      </g>
                    </svg>
                  </a>
                </div>
                <div id="shopMassBoost" class="uk-margin-top">
                  <a href="" data-uk-modal="{target:'#modalShopMass', center:true}">
                    <img src="/app/img/massboost_3x_shop.png" />
                    <svg id="plusMassBoost" viewBox="0 0 30 30">
                      <g>
                        <circle cx="15" cy="15" r="3" stroke="#55b300" stroke-width="0.5px" fill="#69dd00" />
                        <text x="50%" y="50%" text-anchor="middle" stroke="white" stroke-width="0.1px" dy=".28em" font-size="5" fill="white">+</text>
                      </g>
                    </svg>
                  </a>
                </div>
              </div> --></div>
            </div>
			<a href="http://iogames.space" target ="_blank"><button id="moreiogamesButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success" ">More .io games</button></a>
				<!--	<div class="uk-button uk-width-1-1 uk-button-large uk-button-success">	<a href="http://iogames.space" >More .io</a></div> -->

        </div>
        <div id="startMenuRight" class="uk-margin-left">
            <div id="startMenuLoading" class="uk-panel uk-panel-box uk-margin-bottom">
                <svg class="spinner-container uk-align-center" width="65px" height="65px" viewBox="0 0 52 52">
                    <circle class="path" cx="26px" cy="26px" r="20px" fill="none" stroke-width="4px" /> </svg>
                <h1 class="uk-h2 uk-text-center">Connecting</h1>
                <!--   <p>If you cannot connect to the servers, check if you have some antivirus or firewall blocking the connection</p> -->
                <p>We are searching for the fastest servers. If you have a firewall or some antivirus the connection can be blocked</p>
            </div>
            <div id="startMenu" class="uk-panel uk-panel-box uk-margin-bottom uk-hidden">
                <div id="socialButton" class="uk-flex uk-flex-middle uk-flex-space-around">
                    <div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button" data-action="like" data-show-faces="false" data-share="true"></div> <a class="twitter-share-button" href="https://twitter.com/intent/tweet?text=Hello%20world">Tweet</a>
                    <div class="g-ytsubscribe" data-channel="GoogleDevelopers" data-layout="default" data-count="default"></div>
                </div>
                <!-- <h1 class="uk-h2 uk-text-bold uk-text-uppercase uk-text-center">Blobber.io</h1>--> 
               <img class="uk-align-center" src="/app/imgxsolla/Blobberlogo.png" alt="">
                {{#user.userId}}
                <form class="uk-form uk-margin-bottom">
                  <fieldset data-uk-margin>
                    {{#user.username}}
                    <input type="text" tabindex="0" autofocus placeholder="Enter your nickname" id="playerNameInput" maxlength="25" class="uk-width-1-1 uk-form-large" value="{{user.username}}" />
                    {{/user.username}}
                    {{^user.username}}
                    <input type="text" tabindex="0" autofocus placeholder="Enter your nickname" id="playerNameInput" maxlength="25" class="uk-width-1-1 uk-form-large" value="{{user.displayName}}" />
                    {{/user.username}}
                  </fieldset>
                </form>
                <a onclick="document.getElementById('spawn_cell').play();">
                    <button id="startButton" class="uk-button uk-width-1-1 uk-button-large uk-margin-bottom uk-button-success">Play</button>
                </a>
                <button id="exitButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-bottom">Exit</button>
                {{/user.userId}}
                {{^user.userId}}
                <form class="uk-form uk-margin-bottom">
                    <fieldset data-uk-margin>
                        <img id="playerAvatar" src="http://zmp3-photo.d.za.zdn.vn/thumb/165_165/charts_cover/bxh-song-viet-nam-tuan.jpg" class="uk-float-left mask-blober" style="width:115px;height:115px;background-color:#eee;"/>
                        <input type="text" tabindex="0" autofocus placeholder="Your Team" id="playerTeamInput" maxlength="25" class="uk-width-3-5 uk-form-large uk-float-right uk-margin-bottom" /> 
                        <input type="text" tabindex="0" autofocus placeholder="Nick Name" id="playerNameInput" maxlength="25" class="uk-width-3-5 uk-form-large uk-float-right uk-margin-bottom" />
                        <input type="text" tabindex="0" autofocus placeholder="Image Link" id="playerAvatarInput" maxlength="250" class="uk-width-1-1 uk-margin-top" />
                    </fieldset>
                </form>
                <a onclick="document.getElementById('spawn_cell').play();">
                    <button id="startButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-bottom">Play as Guest</button>
                </a>
                <div class="uk-button-group uk-margin-bottom uk-flex uk-flex-center">
                    <a class="uk-button uk-contrast b-facebook" href="/login/facebook"> <i class="uk-icon-facebook uk-margin-small-right"></i>Facebook</a>
                    <a class="uk-button uk-contrast b-google" href="/login/google"> <i class="uk-icon-google-plus uk-margin-small-right"></i>Google+</a>
                    <a class="uk-button uk-contrast b-twitter" href="/login/twitter"> <i class="uk-icon-twitter uk-margin-small-right"></i>Twitter</a>
                </div>
                {{/user.userId}}
                <button id="spectateButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success uk-margin-bottom">Spectate</button>
                {{#user.options}}
                <button id="settingsButton" class="uk-button uk-width-1-1 uk-button-large uk-button-success">Settings</button>
                <div id="settings" class="uk-hidden">
                    <h3>Settings</h3>
                    <ul>
                        {{#user.options.chat}}
                        <label>
                          <input id="showChat" name="chat" type="checkbox" checked>Show chatbox
                        </label>
                        {{/user.options.chat}}
                        {{^user.options.chat}}
                        <label>
                          <input id="showChat" name="chat" type="checkbox">Show chatbox
                        </label>
                        {{/user.options.chat}}
                        {{#user.options.dark}}
                        <label>
                          <input id="darkTheme" name="dark" type="checkbox" checked>Dark Theme
                        </label>
                        {{/user.options.dark}}
                        {{^user.options.dark}}
                        <label>
                          <input id="darkTheme" name="dark" type="checkbox">Dark Theme
                        </label>
                        {{/user.options.dark}}
                        <br />
                        {{#user.options.leaderboard}}
                        <label>
                          <input id="showLeaderboard" name="leaderboard" type="checkbox" checked>Show leaderboard
                        </label>
                        {{/user.options.leaderboard}}
                        {{^user.options.leaderboard}}
                        <label>
                          <input id="showLeaderboard" name="leaderboard" type="checkbox">Show leaderboard
                        </label>
                        {{/user.options.leaderboard}}
                        <br />
                        {{#user.options.border}}
                        <label>
                          <input id="showBorder" name="border" type="checkbox" checked>Show border
                        </label>
                        {{/user.options.border}}
                        {{^user.options.border}}
                        <label>
                          <input id="showBorder" name="border" type="checkbox">Show border
                        </label>
                        {{/user.options.border}}
                        {{#user.options.mass}}
                        <label>
                          <input id="showMass" name="mass" type="checkbox" checked>Show mass
                        </label>
                        {{/user.options.mass}}
                        {{^user.options.mass}}
                        <label>
                          <input id="showMass" name="mass" type="checkbox">Show mass
                        </label>
                        {{/user.options.mass}}
                        <br />
                        {{#user.options.move}}
                        <label>
                          <input id="continuity" name="move" type="checkbox" checked>Continue moving when mouse is off-screen
                        </label>
                        {{/user.options.move}}
                        {{^user.options.move}}
                        <label>
                          <input id="continuity" name="move" type="checkbox">Continue moving when mouse is off-screen
                        </label>
                        {{/user.options.move}}
                    </ul>
                </div>
                {{/user.options}}
            </div>
            <div id="startMenuAdvert" class="uk-panel uk-panel-box">
                <p>
                    <!-- midsplash --><ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-9490373085041113" data-ad-slot="4099605319"></ins>
                    <script>
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    </script>
            </div>
        </div>
    </div>
</div>
<div id="modalShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <div class="uk-flex">
            <div class="uk-margin-small-right">
                <a class="uk-thumbnail uk-margin-small-bottom" data-uk-modal="{target:'#coinsShop', modal:false,center:true}"> <img src="/app/img/coins2.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>Coins</h2></div>
                </a>
                <a class="uk-thumbnail uk-margin-small-top" data-uk-modal="{target:'#skinsShop', modal:false,center:true}"> <img src="/app/img/skins.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>Skins</h2></div>
                </a>
            </div>
            <!--div class="uk-margin-small-left">
                <a class="uk-thumbnail uk-margin-small-bottom" data-uk-modal="{target:'#massShop', modal:false,center:true}"> <img src="/app/img/massboost.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>Mass Boost</h2></div>
                </a>
                <a class="uk-thumbnail uk-margin-small-top" data-uk-modal="{target:'#XPShop', modal:false,center:true}"> <img src="/app/img/xpboost.png" alt="">
                    <div class="uk-thumbnail-caption">
                        <h2>XP Boost</h2></div>
                </a>
            </div-->
        </div>
    </div>
</div>
<div id="skinsShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>Skins</h2>
        <ul class="uk-tab uk-tab-grid uk-tab-bottom" data-uk-switcher="{connect:'#subnav-pill-content-2'}">
            <li class="uk-active uk-width-1-5"><a href="#">Blobs</a></li>
            <li class="uk-width-1-5"><a href="#">Veteran</a></li>
            <li class="uk-width-1-5"><a href="#">Christmas</a></li>
            <li class="uk-width-1-5"><a href="#">Ultimate</a></li>
            <li class="uk-width-1-5"><a href="#">Owned</a></li>
        </ul>
        <ul id="subnav-pill-content-2" class="uk-switcher">
            <li class="uk-active">
                <ul id="switch-multiple-1" class="uk-switcher">
                    <li class="uk-active">
                        <div class="uk-margin-large">
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Parrot</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/prt_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_prt.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;1250</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Monster</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/mon1_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_mon1.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;1650</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail  uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Lion</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/lion01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/lionweapon.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;2050</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Panda</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/panda01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_panda.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;2700</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Robot</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/robot01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_robot1.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;3000</button>
                                </div>
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="uk-margin-large">
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Pirate</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/pr_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_pr.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;3050</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Terminator</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/terminator01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/terminatorweapon.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;3250</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Monster</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/mon2_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_mon2.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;3300</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail  uk-margin-small-left uk-margin-small-left  uk-margin-small-top" href="">
                                <h3>Robot</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/robot201.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/robot2weapon.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;3500</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h4>Transformer</h4><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/transformer01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/transformerweapon.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;3750</button>
                                </div>
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="uk-margin-large">
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Vampire</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/vampire01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_vamp.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;4000</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Goldfish</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/gf01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/water.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;4500</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Snake</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/s01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/tongue.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;5500</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Dinosaur</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/dinosaur01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/dinosaurweapon.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;6250</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Crocodile</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/cr01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/tail.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;7000</button>
                                </div>
                            </a>
                        </div>
                    </li>
                    <li>
                        <div class="uk-margin-large">
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Dragon</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/dr01.png" alt="">
                                <div></div> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/fire.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;9000</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                <h3>Octopus</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/oc01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/tentacle.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;9250</button>
                                </div>
                            </a>
                            <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                <h3>Monster</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/mon3_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_mon3.png" alt="">
                                <div class="uk-thumbnail-caption">
                                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;9500</button>
                                </div>
                            </a>
                        </div>
                    </li>
                </ul>
                <ul class="uk-pagination" data-uk-switcher="{connect:'#switch-multiple-1'}">
                    <li class="uk-active"><span>1</span></li>
                    <li><span>2</span></li>
                    <li><span>3</span></li>
                    <li><span>4</span></li>
                </ul>
            </li>
            <ul id="subnav-pill-content-2" class="uk-switcher">
                <li class="uk-active">
                    <ul id="switch-multiple-2" class="uk-switcher">
                        <li class="uk-active">
                            <div class="uk-margin-large">
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                    <h3>Worm</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/w01.png" alt="">
                                    <div></div> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-worm.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 5</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Fox</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/f01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_f.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 10</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Barbarian</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/bar01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_bar.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 15</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Hyena</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/hy01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-hy.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 20</h3> </div>
                                </a>
                                <a class="uk-thumbnail  uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Scorpion</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/sc01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_sc.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 25</h3> </div>
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="uk-margin-large">
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                    <h3>Yeti</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/ye01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-ye.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 30</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Giant</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/gi01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-gi.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 35</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h4>Eagle</h4><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/ea01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-ea.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 40</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Gorilla</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center uk-align-center" src="/app/imgxsolla/go01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-go.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 45</h3> </div>
                                </a>
                                <a class="uk-thumbnail  uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Beer</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/be01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-be.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 50</h3> </div>
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="uk-margin-large">
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                    <h3>Mammut</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/ma01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-ma.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 55</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Witch</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/wi01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-wi.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 60</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Iron Man</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/P01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-P.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 65</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Ninja</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/ni01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-ni.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 70</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                    <h3>Shark</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/sh01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-sh.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 75</h3> </div>
                                </a>
                            </div>
                        </li>
                        <li>
                            <div class="uk-margin-large">
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                    <h3>Ork</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/orc01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_orc.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 80</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h4>Anonymous</h4><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/an01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-an.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 85</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>Alien</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/al01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-al.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 90</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                                    <h3>God</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/god01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-god.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 95</h3> </div>
                                </a>
                                <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                                    <h3>Wizard</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/wiz01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-wiz.png" alt="">
                                    <div class="uk-thumbnail-caption">
                                        <h3>Level 100</h3> </div>
                                </a>
                            </div>
                        </li>
                    </ul>
                    <ul class="uk-pagination" data-uk-switcher="{connect:'#switch-multiple-2'}">
                        <li class="uk-active"><span>1</span></li>
                        <li><span>2</span></li>
                        <li><span>3</span></li>
                        <li><span>4</span></li>
                    </ul>
                </li>
            </ul>
            <li>
                <div class="uk-margin-large">
                    <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                        <h3>Rendeer</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/r01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-re.png" alt="">
                        <div class="uk-thumbnail-caption">
                            <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;5000</button>
                        </div>
                    </a>
                    <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                        <h4>Santa Claus</h4><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/san01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_san.png" alt="">
                        <div class="uk-thumbnail-caption">
                            <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;6000</button>
                        </div>
                    </a>
                    <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                        <h3>Sceleton</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/sk01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-sk.png" alt="">
                        <div class="uk-thumbnail-caption">
                            <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;6150</button>
                        </div>
                    </a>
                    <a class="uk-thumbnail uk-margin-small-right uk-margin-small-left uk-margin-small-top" href="">
                        <h3>Snowman</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/sn01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-sn.png" alt="">
                        <div class="uk-thumbnail-caption">
                            <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;6250</button>
                        </div>
                    </a>
                    <a class="uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                        <h3>X-Tree</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/tree01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon-tree.png" alt="">
                        <div class="uk-thumbnail-caption">
                            <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;7000</button>
                        </div>
                    </a>
                </div>
            </li>
        </ul>
    </div>
</div>
<div id="massShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>Mass</h2>
        <div class="uk-flex">
            <a class="uk-width-1-3 uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                <h3>Parrot</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/prt_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_prt.png" alt="">
                <div class="uk-thumbnail-caption">
                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;1250</button>
                </div>
            </a>
            <a class="uk-width-1-3 uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                <h3>Monster</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/mon1_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_mon1.png" alt="">
                <div class="uk-thumbnail-caption">
                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;1650</button>
                </div>
            </a>
            <a class="uk-width-1-3 uk-thumbnail uk-margin-small-top" href="">
                <h3>Lion</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/lion01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/lionweapon.png" alt="">
                <div class="uk-thumbnail-caption">
                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;2050</button>
                </div>
            </a>
        </div>
    </div>
</div>
<div id="XPShop" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <h2>XP</h2>
        <div class="uk-flex">
            <a class="uk-width-1-3 uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                <h3>Parrot</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/prt_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_prt.png" alt="">
                <div class="uk-thumbnail-caption">
                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;1250</button>
                </div>
            </a>
            <a class="uk-width-1-3 uk-thumbnail uk-margin-small-right uk-margin-small-top" href="">
                <h3>Monster</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/mon1_01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/weapon_mon1.png" alt="">
                <div class="uk-thumbnail-caption">
                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;1650</button>
                </div>
            </a>
            <a class="uk-width-1-3 uk-thumbnail uk-margin-small-top" href="">
                <h3>Lion</h3><img class="uk-margin-large-top uk-margin-small-bottom uk-align-center" src="/app/imgxsolla/lion01.png" alt=""> <img class="uk-margin-small-top uk-margin-small-bottom" src="/app/imgxsolla/lionweapon.png" alt="">
                <div class="uk-thumbnail-caption">
                    <button class="uk-button uk-button-primary" type="button" data-uk-button> <img src="/app/img/coingold.png" alt="">&nbsp;2050</button>
                </div>
            </a>
        </div>
    </div>
</div>
<div id="modalFreeCoins" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <p>FreeCoins</p>
    </div>
</div>
<div id="modalAddCoins" class="uk-modal">
    <div class="uk-modal-dialog">
        <a class="uk-modal-close uk-close"></a>
        <p>Add Coins</p>
    </div>
</div>
<div id="optionButtons" class="uk-hidden">
    <div class="uk-button-dropdown" data-uk-dropdown="{mode:'click'}">
        <button class="uk-button uk-button-primary"> Powers <i class="uk-icon-caret-up"></i> </button>
        <div class="uk-dropdown uk-dropdown-small">
          <ul id="dropPowers" class="uk-nav uk-nav-dropdown b-powers">
            {{#powers.droplist}}
            {{#value}}
            <li><a class="link-power power-current" name="{{key}}">{{key}}</a></li>
            {{/value}}
            {{^value}}
            <li><a class="link-power" name="{{key}}">{{key}}</a></li>
            {{/value}}
            {{/powers.droplist}}
          </ul>
        </div>
    </div>
    <div class="uk-button-group">
      {{#user.options.chat}}
        <button class="uk-button uk-button-primary button-chatbox"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-chatbox">Chatbox</button>
        {{/user.options.chat}}
        {{^user.options.chat}}
        <button class="uk-button uk-button-danger button-chatbox uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-chatbox uk-active">Chatbox</button>
        {{/user.options.chat}}
    </div>
    <div class="uk-button-group">
      {{#user.options.dark}}
        <button class="uk-button uk-button-danger button-theme uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-theme uk-active">Dark Theme</button>
        {{/user.options.dark}}
        {{^user.options.dark}}
        <button class="uk-button uk-button-primary button-theme"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-theme">Dark Theme</button>
        {{/user.options.dark}}
    </div>
    <div class="uk-button-group">
      {{#user.options.mass}}
        <button class="uk-button uk-button-danger button-mass uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-mass uk-active">Show Mass</button>
        {{/user.options.mass}}
        {{^user.options.mass}}
        <button class="uk-button uk-button-primary button-mass"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-mass">Show Mass</button>
        {{/user.options.mass}}
    </div>
    <div class="uk-button-group">
      {{#user.options.leaderboard}}
        <button class="uk-button uk-button-primary button-leaderboard"><i class="uk-icon-check"></i></button>
        <button class="uk-button button-leaderboard">Leaderboard</button>
        {{/user.options.leaderboard}}
        {{^user.options.leaderboard}}
        <button class="uk-button uk-button-danger button-leaderboard uk-active"><i class="uk-icon-close"></i></button>
        <button class="uk-button button-leaderboard uk-active">Leaderboard</button>
        {{/user.options.leaderboard}}
    </div>
</div>
<div id="bottomBanner" class="uk-panel uk-panel-box">
    <!-- blobberbottom --><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-9490373085041113" data-ad-slot="7611474913"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    <!-- <img src="/app/img/lorem3.jpg" /> --></div>
<script src="https://apis.google.com/js/platform.js"></script>
