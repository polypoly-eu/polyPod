import DataStructureInfoScreen from "./views/infoScreens/dataStructureInfoScreen/dataStructureInfoScreen.jsx";
import ActivitiesInfoScreen from "./views/infoScreens/activitiesInfoScreen/activitiesInfoScreen.jsx";
import MessagesInfoScreen from "./views/infoScreens/messagesInfoScreen/messagesInfoScreen.jsx";
import PicturesInfoScreen from "./views/infoScreens/picturesInfoScreen/picturesInfoScreen.jsx";
import PostReactionInfoScreen from "./views/infoScreens/postReactionInfoScreen/postReactionInfoScreen.jsx";
import OnOffFacebookInfoScreen from "./views/infoScreens/onOffFacebookInfoScreen/onOffFacebookInfoScreen.jsx";
import OffFacebookInfoScreen from "./views/infoScreens/onOffFacebookInfoScreen/offFacebookInfoScreen.jsx";

<Route exact path="/report/details/activities-info">
                        <ActivitiesInfoScreen />
                    </Route>
                    <Route exact path="/report/details/messages-info">
                        <MessagesInfoScreen />
                    </Route>
                    <Route exact path="/report/details/on-off-facebook-info">
                        <OnOffFacebookInfoScreen />
                    </Route>
                    <Route exact path="/report/details/off-facebook-info">
                        <OffFacebookInfoScreen />
                    </Route>
                     <Route exact path="/report/data-structure-info">
                     <DataStructureInfoScreen />
                 </Route>
                 <Route exact path="/report/pictures-info">
                     <PicturesInfoScreen />
                 </Route>
                 <Route exact path="/report/reaction-types-info">
                     <PostReactionInfoScreen />
                 </Route>