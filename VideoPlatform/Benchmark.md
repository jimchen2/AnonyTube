# CPU MongoDB Benchmarks

- 13th Gen Intel(R) Core(TM) i5-1340P
- CPU(s): 16
- 12 cores, 2 threads per core (16 total threads)
- 1 socket
- Max frequency: 4.6 GHz
- Min frequency: 400 MHz
- BogoMIPS: 4379.00

Cache
- L1 Data Cache (L1d): 448 KiB (12 instances)
- L1 Instruction Cache (L1i): 640 KiB (12 instances)
- L2 Cache: 9 MiB (6 instances)
- L3 Cache: 12 MiB (1 instance)

Part of the reason why this is slow is because of argon2 hash, I compute argon2 for both all password, token distribution, and email/phone verification
## User Creation
- Creating 1,000 users took `25.725 seconds`.

## User Relationships
- When 1,000 users each followed 20 other users:
  - Following random users took `41.559 seconds`.
- When 100 users each blocked 3 other users:
  - Blocking random users took `0.705 seconds`.

## User Listing and Information Retrieval
- Listing 1,000 users took `0.008 seconds`.
- Retrieving information for all 1,000 users took `4.856 seconds`.

## User Authentication
- When 1,000 users tried to login simultaneously:
  - The login process took `32.554 seconds`.

## Edge Cases
- Creating 100 users with long usernames (10,000 characters each) took `3.361 seconds`.

## User Relationships Retrieval
- Retrieving the list of users that all 1,000 users are following took `6.024 seconds`.

## User Information Updates
- Updating the username for all 1,000 users took `6.660 seconds`.
- Updating the password for all 1,000 users took `7.185 seconds`.