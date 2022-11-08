import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Calendar from 'react-calendar'
import {
  add,
  eachHourOfInterval,
  format,
  formatDistance,
  isEqual,
  isToday,
  startOfDay,
  startOfToday,
  sub,
} from 'date-fns'
import Image from 'next/image'

type Duration = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'next workday'

type Reservations = Record<string, { name: string; duration: Duration }[]>

function isDuration(duration: string): duration is Duration {
  return ['1', '2', '3', '4', '5', '6', '7', '8', 'next workday'].includes(
    duration,
  )
}

const Home: NextPage = () => {
  const now = new Date()

  const [selectedDate, setSelectedDate] = useState<null | Date>(null)
  const [name, setName] = useState('')
  const [duration, setDuration] = useState<Duration>('1')
  const [hover, setHover] = useState(false)

  const [reservations, setReservations] = useState<Reservations>({
    '2022-11-09': [
      {
        name: 'John Doe',
        duration: '1',
      },
      {
        name: 'Jane Doe',
        duration: '2',
      },
    ],
  })

  let workingHours = eachHourOfInterval({
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9),
    end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17),
  }).map((h) => format(h, 'HH:mm'))

  const lastHour = workingHours[workingHours.length - 1]
  const isPassedWorkingHours = now.getHours() >= parseInt(lastHour)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ name, duration })
    if (selectedDate) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd')
      const reservation = { name, duration }

      if (reservations[dateKey]?.find((r) => r.name === reservation.name))
        return

      setReservations((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), reservation],
      }))
    }
  }

  // start 9am and end 5pm

  console.log('hours', workingHours)

  const inputDisabled = !selectedDate
  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  console.log('selectedDate', selectedDate)
  if (selectedDate) {
    const submittedDurations = reservations[formattedDate]
      ?.map((r) => r.duration)
      .reduce((acc, cur) => acc + parseInt(cur), 0)
    console.log(submittedDurations)
    workingHours = workingHours.slice(submittedDurations)

    const hoursLeft = formatDistance(now, selectedDate)
    console.log(hoursLeft)
  }

  const selectedDayReservations = reservations[formattedDate] || []

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="mt-14">
        <h1 className="text-4xl lg:text-6xl font-bold">
          Welcome to the{' '}
          <p className="text-blue-600 sm:inline">Reservation App</p>
        </h1>
      </header>
      <main className="flex w-full flex-1 flex-col items-center mt-16 md:px-20 text-center">
        <div className="flex flex-col md:flex-row md:w-full xl:w-[60%] justify-around">
          <div>
            <div className="mb-8 flex min-h-[308px]">
              <Calendar
                className="border-1 border-gray-300 rounded-md"
                value={selectedDate}
                onChange={setSelectedDate}
                tileContent={({ date, view }) => {
                  if (view === 'month') {
                    const dateKey = format(date, 'yyyy-MM-dd')
                    const length = reservations[dateKey]?.length
                    // const disabled = isPassedWorkingHours && isToday(date)
                    const isTodayReserved = !!reservations[
                      format(date, 'yyyy-MM-dd')
                    ]?.some((r) => r.duration === 'next workday')

                    if (length) {
                      return (
                        <div
                          onMouseEnter={() => setHover(true)}
                          onMouseLeave={() => setHover(false)}
                          style={{
                            backgroundColor: hover
                              ? '#1087af'
                              : isTodayReserved
                              ? 'initial'
                              : `rgba(0, 255, 0, ${length / 10})`,
                          }}
                          className="h-full w-full absolute top-0 left-0 flex items-center justify-center"
                        >
                          <p
                            className={`${
                              hover ? 'block text-white' : 'hidden'
                            }`}
                          >
                            {length} res
                          </p>
                        </div>
                      )
                    }
                  }
                  return null
                }}
                tileDisabled={({ date }) => {
                  const isNotWorkday =
                    format(date, 'iiii') === 'Sunday' ||
                    format(date, 'iiii') === 'Saturday'

                  const isPast =
                    date.getTime() <
                    new Date().getTime() -
                      (isPassedWorkingHours ? 0 : 1000 * 60 * 60 * 24)

                  const isTodayReserved = !!reservations[
                    format(date, 'yyyy-MM-dd')
                  ]?.some((r) => r.duration === 'next workday')

                  return isNotWorkday || isTodayReserved || isPast
                }}
              />
            </div>
            <form onSubmit={onSubmit} className="flex flex-col">
              <input
                type="text"
                className="border-2 border-gray-300 bg-white h-11 px-5 pr-16 rounded-lg text-md focus:outline-none
                        disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={inputDisabled}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <select
                name="duration"
                id="duration"
                className="mt-6 border-2 border-gray-300
                      bg-white h-11 px-4 pr-16 rounded-lg text-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={inputDisabled}
                value={duration}
                onChange={(e) => {
                  if (isDuration(e.target.value)) {
                    setDuration(e.target.value)
                  }
                }}
                placeholder="Enter duration"
              >
                {workingHours.map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} hour{i > 0 && 's'}
                  </option>
                ))}
                <option value="next workday">next workday</option>
              </select>
              <button
                disabled={!name || !duration}
                className="mt-4 bg-blue-500 transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:hover:bg-blue-500 disabled:cursor-not-allowed"
              >
                Reserve
              </button>
            </form>
          </div>
          <ul className="text-left">
            <h2 className="font-semibold mt-8 md:mt-0 text-gray-900 mb-6">
              Schedule for{' '}
              {format(selectedDate || startOfToday(), 'MMMM dd, yyy')}{' '}
            </h2>
            {selectedDayReservations.length > 0 ? (
              selectedDayReservations.map(({ name, duration }, i) => {
                const durationText =
                  duration === 'next workday'
                    ? duration
                    : `${duration} ${duration === '1' ? 'hour' : 'hours'}`

                return (
                  <li key={name} className="flex mb-4">
                    <Image
                      width={45}
                      height={45}
                      src={`https://randomuser.me/api/portraits/women/${
                        i + 10
                      }.jpg`}
                      alt="avatar"
                      className="rounded-full mr-4"
                    />
                    <div>
                      <p>{name}</p>
                      <p className="text-gray-400">{durationText}</p>
                    </div>
                  </li>
                )
              })
            ) : (
              <p className="text-gray-400">No reservations</p>
            )}
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Home
