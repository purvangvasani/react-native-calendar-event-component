# Calendar Component in React Native

In this Calendar component, the user can add reminders of their daily lives. They can Update/View/Delete that reminders as well. A Notification of the reminder is sent to the user half an hour before the time of the reminder. Users can view their reminders just by clicking the day and reminders will be visible to them. As the app closes, the reminders are still saved in the local database which is Async Storage. 

### Dependencies of these project:
 1) react: 16.8.3
 2) react-native: 0.59.9
 3) native-base: ^2.12.1  ( Used different components )
 4) @react-native-community/async-storage: ^1.5.0  ( Local Storage )
 5) moment: ^2.24.0  ( Handles Time Variables )
 6) react-native-calendars: ^1.188.0  ( Display calendar component )
 7) react-native-events-calendar: ^1.0.8   ( Shows event according to dates )
 8) react-native-firebase: ^5.5.3  ( Scheduled Notification ) 
 9) react-native-gesture-handler: ^1.3.0  ( Handling Smooth Navigation through screens )
 10) react-native-lottie-loader: 0.0.5  ( Loader )
 11) react-native-modal: ^11.0.2  ( Modal for Add/Update/View )
 12) react-native-modal-datetime-picker: ^7.4.2  ( Select Date Time )
 13) react-native-simple-toast: 0.0.8  ( Shows Toast after submitting Events )
 14) react-native-switch-toggle: ^1.1.0  ( Toggle Switch to enable Notification )
 15) react-native-vector-icons: ^6.5.0  ( Different Icons used in the app )
 16) react-navigation: ^3.11.0  ( To navigate screens )
 17) react-redux: ^7.1.0  ( Storing data ) 
 18) redux: ^4.0.1

## Loader
![Loader Screen](https://github.com/purvangvasani/react-native-calendar-event-component/blob/master/src/screenshots/Loader.png?raw=true "Optional Title")
(Fig,1 - Loader Screen)

This loader is from the npm plugin react-native-Lottie-loader. First, the app checks in AsyncStorage whether there are any events or reminders previously saved by the user or not. If there are any, then the app fetches the data of the event or reminder from Storage and stores in-app store with the help of react-redux. And, it is then displayed to the user in the Calendar screen (Fig 4). Also, if there are no data available in the AsyncStorage of the app then empty Calendar screen (Fig 2) will be shown.


## Calendar 
![Calendar Screen](https://github.com/purvangvasani/react-native-calendar-event-component/blob/master/src/screenshots/CalendarScreen.png?raw=true "Optional Title")
(Fig.2 - Calendar Screen)

From react-native-calendar, ExpandableCalendar is used to date. As the name suggests, this component expands on the pull request by the user, which then shows a whole month days. This component has the functionality to move back and forth into the months with the side arrows. On day click, the date prop is passed down to the react-native-events-calendar component.

react-native-events-calendar is used here to show the events filtered by the date onClick event. The date prop which is passed by the react-native-calendar is used in the initDate method of EventCalendar component. 

The Fab component is from native-base. It will open the modal view react-native-modal. By this npm plugin, users can add events or reminders to the calendar. By default, the current date and time are passed to the Add modal.


## Add Event Modal
![Add Event Screen](https://github.com/purvangvasani/react-native-calendar-event-component/blob/master/src/screenshots/AddEvent.png?raw=true "Optional Title")
(Fig.3 - Add Event Modal)

The modal contains the following fields:
 1) Title
 2) Description
 3) From DateTime
 4) To DateTime
 5) Enable notification switch

Title and Description are text fields. FROM-TO DateTime is the datetimepicker from react-native-modal-DateTime-picker. Validations are added to the DateTime. FROM Datetime is compared with the current day’s DateTime. If selected DateTime is less than current date times then the DateTime becomes Red in color. And the event will not be submitted. 

The enable notification event switch, when ON, triggers the set reminder method. This method communicates with the firebase and scheduled the notification using a build notification method. 
View this repo, to understand more about scheduling notification using firebase and how to install it.

In this method, notification, title, body, and priority are set, which results in the notification scheduled.

The unique notificationID is also generated for the notification.

![Event View Screen](https://github.com/purvangvasani/react-native-calendar-event-component/blob/master/src/screenshots/EventView.png?raw=true "Optional Title")
(Fig.4 - Event View)

The above figure shows the event entry in the list and the dates are marked in the Calendar component. This functionality helps users to see on which dates the entries are available. The getMarkedDates method fetches the store data of the events and creates an array with index as dates of the event. This array is passed to the CalendarProvider which shows the dots to the calendar component.
 

## View Event Modal

![View Screen](https://github.com/purvangvasani/react-native-calendar-event-component/blob/master/src/screenshots/EventView.png?raw=true "Optional Title")
(Fig.5 - View Event Modal)

The user can view the event details just by tapping on the event from the list. From that view Modal, the user gets the option of whether to edit the event or to delete the event.

By tapping the trash icon, the assurance popup appears on the screen which asks for permission to delete the event.

By tapping the pen icon, the Update Event Modal will appears on the screen. From which, the user can update the event.

![Update Event Screen](https://github.com/purvangvasani/react-native-calendar-event-component/blob/master/src/screenshots/UpdateEvent.png?raw=true "Optional Title")
(Fig.6 - Update Event Modal)

The Update modal updates the event. 
