import {Component, OnInit} from '@angular/core';
import {LessonsService} from "../services/lessons.service";
import {Observable} from "rxjs/Observable";
import {Lesson} from "../model/lesson";
import {SwPush} from "@angular/service-worker";
import {NewsletterService} from "../services/newsletter.service";

@Component({
    selector: 'lessons',
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

    lessons$: Observable<Lesson[]>;
    isLoggedIn$: Observable<boolean>;

    sub: PushSubscription;

    readonly VAPID_PUBLIC_KEY = "BNcqrTZPI8VKShEohLDOsePBAt0sHT-m7lRLQ8QdoOxEmTylnBaORrdtc9EJFjUEmbGlOQ9CMe9Bl7sIW6ibqfQ";

    constructor(
        private lessonsService: LessonsService,
        private swPush: SwPush,
        private newsletterService: NewsletterService) {

    }

    ngOnInit() {
        this.loadLessons();
    }


    loadLessons() {
        this.lessons$ = this.lessonsService.loadAllLessons().catch(err => Observable.of([]));
    }

    subscribeToNotifications() {

        this.swPush.requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY
        })
        .then(sub => {

            this.sub = sub;


            console.log("Notification Subscription: ", sub);

            this.newsletterService.addPushSubscriber(sub).subscribe(
                () => console.log('Sent push subscription object to server.'),
                err =>  console.log('Could not send subscription object to server, reason: ', err)
            );

        })
        .catch(err => console.error("Could not subscribe to notifications", err));

        this.swPush.notificationClicks.subscribe((result) => {
          console.log('clicked', result);
        });

    }


    sendNewsletter() {


        console.log("Sending Newsletter to all Subscribers ...");

        this.newsletterService.send().subscribe();
    }





}
