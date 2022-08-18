package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gopkg.in/telebot.v3"
)

var count int

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	pref := telebot.Settings{
		Token:  os.Getenv("BOT_TOKEN"),
		Poller: &telebot.LongPoller{Timeout: 10 * time.Second},
	}
	bot, err := telebot.NewBot(pref)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	client, err := firestore.NewClient(ctx, os.Getenv("GCP_PROJECT_ID"), option.WithCredentialsJSON([]byte(os.Getenv("GCP_SERVICE_ACCOUNT"))))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	log.Println("Starting to listen for registrations...")
	registrationsListener(ctx, client, bot)
}

func registrationsListener(ctx context.Context, client *firestore.Client, bot *telebot.Bot) {
	// parse group id from env
	groupId, err := strconv.ParseInt(os.Getenv("TG_GROUP_ID"), 10, 64)
	if err != nil {
		log.Fatalf("failed to parse telegram group id: %v", err)
	}

	it := client.Collection("cyc-pkrg/summer-camp/registrations").Snapshots(ctx)
	for {
		snap, err := it.Next()
		// handle if context exceeded
		if status.Code(err) == codes.DeadlineExceeded {
			log.Fatalf("context exceeded: %v", err)
		}
		if err != nil {
			log.Fatalf("Snapshots.Next: %v", err)
		}
		docs, err := snap.Documents.GetAll()
		if err != nil {
			log.Fatalf("failed to get documents: %v", err)
		}
		for _, doc := range docs {
			// skip notified
			notified, ok := doc.Data()["notified"]
			if !ok || notified == "true" {
				continue
			}

			// update notified
			_, err = client.Collection("cyc-pkrg/summer-camp/registrations").Doc(doc.Ref.ID).Update(ctx, []firestore.Update{
				{
					Path:  "notified",
					Value: "true",
				},
			})
			if err != nil {
				log.Printf("failed to update notified to true: %v", err)
			}

			// send message
			_, err := bot.Send(&telebot.Chat{ID: groupId}, fmt.Sprintf("🎉 %s (%s) has just registered under %s!", doc.Data()["name"], doc.Data()["phoneNumber"], doc.Data()["cg"]))
			if err != nil {
				log.Printf("failed to send telegram message to group: %v", err)
			}

			// log
			count++
			log.Printf("Registration received from %s.\n", doc.Data()["name"])
			log.Printf("Total %d notifications sent.\n", count)
		}
	}
}
