import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Lesson() {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    async function fetchLessons() {
      const { data, error } = await supabase.from('lessons').select('*');
      if (error) {
        console.error('Erreur récupération leçons:', error);
      } else {
        setLessons(data);
      }
    }
    fetchLessons();
  }, []);

  return (
    <div>
      <h2>Liste des leçons</h2>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <h3>{lesson.title}</h3>
            <p>{lesson.description}</p>
            {lesson.video_url && (
              <iframe
                width="560"
                height="315"
                src={lesson.video_url}
                title={lesson.title}
                frameBorder="0"
                allowFullScreen
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}